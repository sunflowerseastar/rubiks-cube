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
 *
 * | Variable  | What it is                                 | Examples              |
 * |-----------+--------------------------------------------+-----------------------|
 * | rotCubie  | the three.js cubie                         | rotCubieL, rotCubieTR |
 * | iq        | initial quaternion (pre-rotation)          | iql, iqtr             |
 * | mq        | multiplied quaternion (end goal)           | mql, mqtr             |
 * | pt        | xyz point on a given rotation path per /t/ | pt90                  |
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

import { createUp } from "./utilities.js";
import { RotationPath } from "./rotationPath.js";
import {
  cubieEdgeSize,
  cubieSizePlusGapSize,
  faceIndexToCubieLocationsLookup,
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

// up, edgeRotationPath, and normalAxis are recalculated on every rotation init
// based on which face it is
let up;
let edgeRotationPath, cornerRotationPath;

// |----+---+----|
// | TL | T | TR |
// |----+---+----|
// |  L | C |  R |
// |----+---+----|
// | BL | B | BR |
// |----+---+----|
let iqc, iqr, iqt, iql, iqb;
let iqtr, iqtl, iqbl, iqbr;
let mqc, mqr, mqt, mql, mqb;
let mqtr, mqtl, mqbl, mqbr;

// This is a generic Vector3 so 'axis' can be calculated in the animation loop
// without having to create transient objects over and over.
let v3 = new Vector3();

let rotationFaceCornerCubies = [];

let rotCubieC, rotCubieB, rotCubieL, rotCubieT, rotCubieR;
let rotCubieTR, rotCubieTL, rotCubieBL, rotCubieBR;

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

  userRotationQueueEnqueue(userRotation) {
    this.userRotationQueue.push(userRotation);
  }
  userRotationQueueDequeue() {
    this.userRotationQueue = this.userRotationQueue.slice(1);
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
          edgeRotationPath = new RotationPath(cubieSizePlusGapSize, axis, sign);
          const distCorner = Math.hypot(
            cubieSizePlusGapSize,
            cubieSizePlusGapSize
          );
          cornerRotationPath = new RotationPath(
            distCorner,
            axis,
            sign,
            cubieSizePlusGapSize
          );
          up = createUp(axis, sign);
          // console.log("up", up);

          // 'C' is 'Center'
          rotCubieC = this.cubiesMeshes.find(
            (c) => c.location === centerCubieIndex
          );
          iqc = rotCubieC.quaternion.clone();
          rotCubieR = this.cubiesMeshes.find(
            (c) => c.location === edgeLocations[0]
          );
          iqr = rotCubieR.quaternion.clone();
          rotCubieT = this.cubiesMeshes.find(
            (c) => c.location === edgeLocations[1]
          );
          iqt = rotCubieT.quaternion.clone();
          rotCubieL = this.cubiesMeshes.find(
            (c) => c.location === edgeLocations[2]
          );
          iql = rotCubieL.quaternion.clone();
          rotCubieB = this.cubiesMeshes.find(
            (c) => c.location === edgeLocations[3]
          );
          iqb = rotCubieB.quaternion.clone();
          rotCubieTR = this.cubiesMeshes.find(
            (c) => c.location === cornerLocations[0]
          );
          iqtr = rotCubieTR.quaternion.clone();
          rotCubieTL = this.cubiesMeshes.find(
            (c) => c.location === cornerLocations[1]
          );
          iqtl = rotCubieTL.quaternion.clone();
          rotCubieBL = this.cubiesMeshes.find(
            (c) => c.location === cornerLocations[2]
          );
          iqbl = rotCubieBL.quaternion.clone();
          rotCubieBR = this.cubiesMeshes.find(
            (c) => c.location === cornerLocations[3]
          );
          iqbr = rotCubieBR.quaternion.clone();

          // one quarter turn per the 'up' of the currently rotating face
          const currentFace90q = new Quaternion();
          currentFace90q.setFromAxisAngle(up, MathUtils.degToRad(90));

          // 'mq' means 'multiplied quaternion'. Essentially, take the current
          // quaternion of a cubie and multiply it by a 90 degree rotation.
          mqc = new Quaternion();
          mqc.multiplyQuaternions(currentFace90q, iqc);
          mqr = new Quaternion();
          mqr.multiplyQuaternions(currentFace90q, iqr);
          mqt = new Quaternion();
          mqt.multiplyQuaternions(currentFace90q, iqt);
          mql = new Quaternion();
          mql.multiplyQuaternions(currentFace90q, iql);
          mqb = new Quaternion();
          mqb.multiplyQuaternions(currentFace90q, iqb);
          mqtr = new Quaternion();
          mqtr.multiplyQuaternions(currentFace90q, iqtr);
          mqtl = new Quaternion();
          mqtl.multiplyQuaternions(currentFace90q, iqtl);
          mqbl = new Quaternion();
          mqbl.multiplyQuaternions(currentFace90q, iqbl);
          mqbr = new Quaternion();
          mqbr.multiplyQuaternions(currentFace90q, iqbr);

          // 2. Rotate the system-cubies

          // Update the rotated cubies' `location` property with their new locations
          this.cubiesMeshes.forEach((c) => {
            if (edgeLocations.includes(c.location)) {
              const arrayIndex = edgeLocations.indexOf(c.location);
              const newIndex =
                (arrayIndex +
                  (isCounterClockwise ? 1 : edgeLocations.length - 1)) %
                edgeLocations.length;
              const newLocation = edgeLocations[newIndex];
              c.location = newLocation;
            } else if (cornerLocations.includes(c.location)) {
              const arrayIndex = cornerLocations.indexOf(c.location);
              const newIndex =
                (arrayIndex +
                  (isCounterClockwise ? 1 : cornerLocations.length - 1)) %
                cornerLocations.length;
              const newLocation = cornerLocations[newIndex];
              c.location = newLocation;
            } else {
              // do nothing, ignore other cubies
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
          this.userRotationQueueDequeue();
          isReadyToInitNewUserRotation = true;
        }

        const pt = edgeRotationPath.getPoint(t);
        rotCubieR.position.set(pt.x, pt.y, pt.z);
        const pt90 = edgeRotationPath.getPoint(t + 0.25);
        rotCubieT.position.set(pt90.x, pt90.y, pt90.z);
        const pt180 = edgeRotationPath.getPoint(t + 0.5);
        rotCubieL.position.set(pt180.x, pt180.y, pt180.z);
        const pt270 = edgeRotationPath.getPoint(t + 0.75);
        rotCubieB.position.set(pt270.x, pt270.y, pt270.z);

        const pt125 = cornerRotationPath.getPoint(t + 0.125);
        rotCubieTR.position.set(pt125.x, pt125.y, pt125.z);
        const pt375 = cornerRotationPath.getPoint(t + 0.375);
        rotCubieTL.position.set(pt375.x, pt375.y, pt375.z);
        const pt625 = cornerRotationPath.getPoint(t + 0.625);
        rotCubieBL.position.set(pt625.x, pt625.y, pt625.z);
        const pt875 = cornerRotationPath.getPoint(t + 0.875);
        rotCubieBR.position.set(pt875.x, pt875.y, pt875.z);

        rotCubieC.quaternion.slerpQuaternions(iqc, mqc, t * 4).normalize();
        rotCubieR.quaternion.slerpQuaternions(iqr, mqr, t * 4).normalize();
        rotCubieT.quaternion.slerpQuaternions(iqt, mqt, t * 4).normalize();
        rotCubieL.quaternion.slerpQuaternions(iql, mql, t * 4).normalize();
        rotCubieB.quaternion.slerpQuaternions(iqb, mqb, t * 4).normalize();

        rotCubieTR.quaternion.slerpQuaternions(iqtr, mqtr, t * 4).normalize();
        rotCubieTL.quaternion.slerpQuaternions(iqtl, mqtl, t * 4).normalize();
        rotCubieBL.quaternion.slerpQuaternions(iqbl, mqbl, t * 4).normalize();
        rotCubieBR.quaternion.slerpQuaternions(iqbr, mqbr, t * 4).normalize();
      } // END IS-ROTATING

      // OrbitControls
      controls.update();

      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }
}

export { Loop };
