import { Clock, Curve, Matrix4, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const clock = new Clock();

const cubieEdgeSize = 100;
const gapSize = 30;
const halfway = (cubieEdgeSize + gapSize) / 2;
const cubieSizePlusGapSize = cubieEdgeSize + gapSize;

let controls;

let isReadyToInitNewUserRotation = true;

var t = 0;
let tangent;
var up = new Vector3(0, 1, 0);
var axis = new Vector3();

function Ellipse(xRadius, yRadius) {
  this.xRadius = xRadius;
  this.yRadius = yRadius;
}
Ellipse.prototype = Object.create(Curve.prototype);
Ellipse.prototype.constructor = Ellipse;
Ellipse.prototype.getPoint = function (t) {
  var radians = 2 * Math.PI * t;

  return new Vector3(
    this.xRadius * Math.cos(radians),
    this.yRadius * Math.sin(radians),
    cubieSizePlusGapSize
  );
};

let path = new Ellipse(cubieSizePlusGapSize, cubieSizePlusGapSize);

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
    this.userRotationQueue = [];

    controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.3;
  }

  addUserRotationToQueue(userRotation) {
    console.log('addUserRotationToQueue(userRotation)', userRotation);
    this.userRotationQueue.push(userRotation);
    console.log('this.userRotationQueue', this.userRotationQueue);
  }
  popUserRotationQueue() {
    console.log('this.popUserRotationQueue b', this.popUserRotationQueue);
    this.userRotationQueue.pop();
    console.log('this.popUserRotationQueue a', this.popUserRotationQueue);
  }

  start() {
    console.log('start()');
    this.renderer.setAnimationLoop(() => {
      // console.log('animate')
      // tell every animated object to tick forward one frame
      this.tick();

      controls.update();

      if (this.userRotationQueue.length > 0) {
        const f1 = this.scene.children[23]; // front - right middle

        if (isReadyToInitNewUserRotation) {
          isReadyToInitNewUserRotation = false;
          console.log('init new rotation', this.userRotationQueue[0]);
          console.log('f1', f1);
        }

        const pt = path.getPoint(t);

        f1.position.set(pt.x, pt.y, pt.z);

        // tangent, axis, angle, quaternion
        tangent = path.getTangent(t).normalize();
        axis.crossVectors(up, tangent).normalize();
        const radians = Math.acos(up.dot(tangent));
        f1.quaternion.setFromAxisAngle(axis, radians);

        t = t >= 1 ? 0 : (t += 0.002);
      }

      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta();

    // console.log(
    //   `The last frame rendered in ${delta * 1000} milliseconds`,
    // );

    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
}

export { Loop };
