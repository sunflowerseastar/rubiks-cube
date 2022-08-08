/*
 * Loop is a complex module because it is determining which cubies rotate, when,
 * and how. The "user rotation" events come from the keypress handlers in
 * World.js. Those events simply push a new userRotation on the
 * userRotationQueue that lives here in Loop.

 * The animation loop is always running, originating from main.js's
 * world.start(). It's always running because we want OrbitControls; as in,
 * opposed to starting the animation loop whenever there are rotations and
 * stopping the animation loop when userRotationQueue is exhausted.

 * The animation loop is automatically always working on the head of the
 * userRotationQueue queue (when it exists). The user rotation event data tells
 * the animation loop which face should be rotated, and whether it's clockwise or
 * counter-clockwise. The logic inside the loop figures out which cubies those
 * are, animates them until the rotation is completed, then pops the rotation off
 * the queue.
 */
import {
  Curve,
  MathUtils,
  Matrix4,
  Object3D,
  Quaternion,
  Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import {
  createUp,
  otherTwoAxes,
  rotateBackward,
  rotateForward,
  round25,
} from "./utilities.js";
import { faceIndexToCubieLocationsLookup } from "./lookupTables.js";
import { RotationPath } from "./components/rotationPath.js";
import {
  cubieEdgeSize,
  cubieSizePlusGapSize,
  gapSize,
  rotationSpeed,
} from "./constants.js";

// state (mutables)

let controls;

let centerCubieIndex;
let isCounterClockwise;
let isReadyToInitNewUserRotation = true;

// 't' is the travel point along the rotation path, expressed from 0 to 1.
let t;
// 'endingT' is set at the init of each rotation to be 90 degrees ahead of t
let endingT;

// up, rotationPath, and normalAxis are recalculated on every rotation init
// based on which face it is
let up;
let rotationPath;
let normalAxis;
let normalSign;
let rq1, tq1, lq1, bq1;

// This is a generic Vector3 so 'axis' can be calculated in the animation loop
// without having to create transient objects over and over.
let v3 = new Vector3();

let rotationFaceCornerCubies = [];

let rotCubieB, rotCubieL, rotCubieT, rotCubieR;

class Loop {
  constructor(camera, scene, renderer, cubiesMeshes) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.cubiesMeshes = cubiesMeshes;
    this.updatables = [];

    // this is the queue that holds the rotations that the user has initiated
    // with keypresses in World.js
    this.userRotationQueue = [];

    controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.3;
  }

  addUserRotationToQueue(userRotation) {
    // console.log("addUserRotationToQueue(userRotation)", userRotation);
    this.userRotationQueue.push(userRotation);
  }
  popUserRotationQueue() {
    // console.log("popUserRotationQueue()");
    this.userRotationQueue.pop();
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      if (this.userRotationQueue.length > 0) {
        // BEGIN IS-ROTATING

        if (isReadyToInitNewUserRotation) {
          // BEGIN INIT
          // console.log("init new rotation", this.userRotationQueue[0]);

          const { centerCubieIndex: cci, isCounterClockwise: icc } =
            this.userRotationQueue[0];
          centerCubieIndex = cci;
          isCounterClockwise = icc;

          // 1. Prepare render-cubies for rotation
          isReadyToInitNewUserRotation = false;

          // a "normal" new RotationPath is counterclockwise by default (as in, if you trace `x = cx + r * cos(rad); y = cy + r * sin(rad)` with t driving the radians from 0 to 2*Math.PI, the circle will be drawn counter-clockwise). So, a "normal" counter-clockwise rotation will go from t 0.0 up to endingT 0.25, and a "reversed" clockwise rotation will go from t 1.0 down to endingT 0.75.
          t = isCounterClockwise ? 0.0 : 1.0;
          endingT = isCounterClockwise ? 0.25 : 0.75;

          const {
            edges: edgeLocations,
            corners: cornerLocations,
            normal: { axis, sign },
          } = faceIndexToCubieLocationsLookup[centerCubieIndex];
          normalAxis = axis;
          normalSign = sign;
          rotationPath = new RotationPath(
            cubieSizePlusGapSize,
            axis,
            normalSign
          );
          console.log("rotationPath", rotationPath);
          up = createUp(axis, normalSign);
          console.log("up", up);

          rotCubieR = this.cubiesMeshes.find(
            (c) => c.location === edgeLocations[0]
          );
          rq1 = rotCubieR.quaternion.clone();
          // console.log("rq1", rq1);
          rotCubieT = this.cubiesMeshes.find(
            (c) => c.location === edgeLocations[1]
          );
          tq1 = rotCubieT.quaternion.clone();
          rotCubieL = this.cubiesMeshes.find(
            (c) => c.location === edgeLocations[2]
          );
          lq1 = rotCubieL.quaternion.clone();
          rotCubieB = this.cubiesMeshes.find(
            (c) => c.location === edgeLocations[3]
          );
          bq1 = rotCubieB.quaternion.clone();

          // 2. Rotate the system-cubies

          // Update the rotated cubies' `location` property with their new locations
          // console.log("edgeLocations", edgeLocations);
          this.cubiesMeshes.forEach((c) => {
            if (edgeLocations.includes(c.location)) {
              const arrayIndex = edgeLocations.indexOf(c.location);
              const newIndex =
                (arrayIndex +
                  (isCounterClockwise ? 1 : edgeLocations.length - 1)) %
                edgeLocations.length;
              const newLocation = edgeLocations[newIndex];
              // console.log('edgeLocations', edgeLocations);
              // console.log("arrayIndex, newIndex", arrayIndex, newIndex);
              // console.log("c.cubieIndex, c.location, newLocation", c.cubieIndex, c.location, newLocation);
              // console.log("c.location newLocation", c.location, newLocation);
              c.location = newLocation;
            } else {
              // do nothing, ignore the non-edges
            }
          });
        } // END INIT

        t = isCounterClockwise ? (t += rotationSpeed) : (t -= rotationSpeed);

        if (
          (isCounterClockwise && t >= endingT) ||
          (!isCounterClockwise && t <= endingT)
        ) {
          // console.log("FINAL ROTATION LOOP");
          t = endingT;
          this.popUserRotationQueue();
          isReadyToInitNewUserRotation = true;
        }

        const pt = rotationPath.getPoint(t);
        // console.log('t, pt', t, pt);
        rotCubieR.position.set(pt.x, pt.y, pt.z);
        const pt90 = rotationPath.getPoint(t + 0.25);
        rotCubieT.position.set(pt90.x, pt90.y, pt90.z);
        const pt180 = rotationPath.getPoint(t + 0.5);
        rotCubieL.position.set(pt180.x, pt180.y, pt180.z);
        const pt270 = rotationPath.getPoint(t + 0.75);
        rotCubieB.position.set(pt270.x, pt270.y, pt270.z);

        // rotCubieR.quaternion.setFromAxisAngle(up, angle).normalize();

        // 'eq' means 'ending quaternion'
        const eq = new Quaternion();
        // eq.setFromAxisAngle(up, angle).normalize();
        // this rotates "backward" (counter-clockwise)
        eq.setFromAxisAngle(up, MathUtils.degToRad(90));
        // this rotates forward (clockwise)
        // eq.setFromAxisAngle(up, MathUtils.degToRad(-90));

        // const sq = new Quaternion()
        // sq.slerpQuaternions(rq1, eq, t * 4)
        // console.log('sq', sq);
        // rotCubieR.quaternion.copy(sq)
        // rotCubieT.quaternion.copy(sq)
        // rotCubieL.quaternion.copy(sq)
        // rotCubieB.quaternion.copy(sq)

        const mq = new Quaternion();
        mq.multiplyQuaternions(rq1, eq);
        // console.log('mq', mq);
        // rotCubieR.quaternion.copy(mq)

        const sq = new Quaternion();
        sq.slerpQuaternions(rq1, mq, t * 4);
        // console.log('sq', sq);
        rotCubieR.quaternion.copy(sq.slerpQuaternions(rq1, mq, t * 4));
        rotCubieT.quaternion.copy(sq.slerpQuaternions(tq1, mq, t * 4));
        rotCubieL.quaternion.copy(sq.slerpQuaternions(lq1, mq, t * 4));
        rotCubieB.quaternion.copy(sq.slerpQuaternions(bq1, mq, t * 4));
      } // END IS-ROTATING

      // OrbitControls
      controls.update();

      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }
  stop() {
    this.renderer.setAnimationLoop(null);
  }
}

export { Loop };
