import {
  AnimationClip,
  AnimationMixer,
  AxesHelper,
  BoxGeometry,
  Clock,
  Color,
  // CubeGeometry,
  Curve,
  EllipseCurve,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  // MeshFaceMaterial,
  MeshPhongMaterial,
  Path,
  PerspectiveCamera,
  PointLight,
  Scene,
  TubeBufferGeometry,
  Vector3,
  VectorKeyframeTrack,
  WebGLRenderer,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var cubes = [],
  marker;
var up = new Vector3(0, 1, 0);
var axis = new Vector3();
var pt, radians, axis, tangent, path;

// the getPoint starting variable
var t = 0;

// Ellipse class, which extends the virtual base class Curve
function Ellipse(xRadius, yRadius) {
  // Curve.call(this);
  // new Curve.call(this);

  // add radius as a property
  this.xRadius = xRadius;
  this.yRadius = yRadius;
}

Ellipse.prototype = Object.create(Curve.prototype);
Ellipse.prototype.constructor = Ellipse;

// define the getPoint function for the subClass
Ellipse.prototype.getPoint = function (t) {
  var radians = 2 * Math.PI * t;

  return new Vector3(
    this.xRadius * Math.cos(radians),
    this.yRadius * Math.sin(radians),
    0
  );
};

//

var mesh, renderer, scene, camera, controls;

function init() {
  // renderer, scene, camera, controls, light, axes
  renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  scene = new Scene();
  camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  // camera.position.set(20, 20, 20);
  camera.position.z = 900;
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  var light = new PointLight(0xffffff, 0.7);
  camera.add(light);
  scene.add(camera);
  scene.add(new AxesHelper(500));

  // cube
  const mgeometry = new BoxGeometry(100, 100, 100);
  const mmaterial = new MeshBasicMaterial({ color: 0xbb0000 });
  marker = new Mesh(mgeometry, mmaterial);
  scene.add(marker);

  // animation path
  path = new Ellipse(500, 500);
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  // set the marker position
  pt = path.getPoint(t);
  // console.log('pt', pt);

  // set the marker position
  marker.position.set(pt.x, pt.y, pt.z);

  // get the tangent to the curve
  tangent = path.getTangent(t).normalize();
  // console.log('tangent', tangent);

  // calculate the axis to rotate around
  axis.crossVectors(up, tangent).normalize();

  // calcluate the angle between the up vector and the tangent
  radians = Math.acos(up.dot(tangent));

  // set the quaternion
  marker.quaternion.setFromAxisAngle(axis, radians);

  t = t >= 100 ? 0 : (t += 0.002);

  renderer.render(scene, camera);
}

init();
animate();
