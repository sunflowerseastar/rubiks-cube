// from https://stackoverflow.com/a/43500997
// plus changes: AxisHelper -> AxesHelper, CubeGeometry -> BoxGeometry, MeshFaceMaterial -> Mesh, comment out ellipse guide

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

// let camera, scene, renderer;
// let controls;
// let mixers = [];
// let clock;

// GLOBALS - ALLOCATE THESE OUTSIDE OF THE RENDER LOOP - CHANGED
var cubes = [],
  marker,
  spline;
var matrix = new Matrix4();
var up = new Vector3(0, 1, 0);
var axis = new Vector3();
var pt, radians, axis, tangent, path;

// the getPoint starting variable - !important - You get me ;)
var t = 0;

//This function generates the cube and chooses a random color for it
//on initial load.

function getCube() {
  // cube mats and cube
  var mats = [];
  for (var i = 0; i < 6; i++) {
    mats.push(new MeshBasicMaterial({ color: Math.random() * 0xffffff }));
  }

  var cube = new Mesh(
    // new CubeGeometry(2, 2, 2),
    new BoxGeometry(2, 2, 2),
    // new MeshFaceMaterial(mats)
    // new MeshBasicMaterial(mats)
    new MeshBasicMaterial({ color: Math.random() * 0xffffff })
    // new Mesh(mats)
  );

  return cube;
}

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
  // renderer
  renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // scene
  scene = new Scene();

  // camera
  camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(20, 20, 20);

  // controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use if there is no animation loop
  controls.minDistance = 10;
  controls.maxDistance = 50;

  // light
  var light = new PointLight(0xffffff, 0.7);
  camera.add(light);
  scene.add(camera); // add to scene only because the camera  has a child

  // axes
  scene.add(new AxesHelper(20));

  ////////////////////////////////////////
  //      Create the cube               //
  ////////////////////////////////////////

  marker = getCube();
  marker.position.set(0, 0, 0);
  scene.add(marker);

  ////////////////////////////////////////
  //      Create an Extruded shape      //
  ////////////////////////////////////////

  // path
  path = new Ellipse(5, 10);

  // params
  var pathSegments = 64;
  var tubeRadius = 0.5;
  var radiusSegments = 16;
  var closed = true;

  var geometry = new TubeBufferGeometry(
    path,
    pathSegments,
    tubeRadius,
    radiusSegments,
    closed
  );

  // material
  var material = new MeshPhongMaterial({
    color: 0x0080ff,
  });

  // mesh
  mesh = new Mesh(geometry, material);
  scene.add(mesh);

  //////////////////////////////////////////////////////////////////////////
  //       Create the path which is based on our shape above              //
  //////////////////////////////////////////////////////////////////////////

  //Please note that this red ellipse was only created has a guide so that I could  be certain that the square is true to the tangent and positioning.

  // Ellipse class, which extends the virtual base class Curve
  var curve = new EllipseCurve(
    0,
    0, // ax, aY
    6,
    11, // xRadius, yRadius
    0,
    2 * Math.PI, // aStartAngle, aEndAngle
    false, // aClockwise
    0 // aRotation
  );

  // var material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
  // var geometry = shape.createPointsGeometry();
  // var line = new THREE.Line( geometry, material );
  // line.position.set( x, y, z );
  // scene.add( line );

  //defines the amount of points the path will have
  // var path2 = new Path(curve.getPoints(100));
  // console.log('path2', path2);
  // // geometrycirc = path2.createPointsGeometry(100);
  // var materialcirc = new LineBasicMaterial({
  //   color: 0xff0000,
  // });

  // Create the final object to add to the scene
  // var ellipse = new Line(geometrycirc, materialcirc);
  // var ellipse = new Line(path2, materialcirc);
  // ellipse.position.set(0, 0, 0);
  // scene.add(ellipse);
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  // set the marker position
  pt = path.getPoint(t);

  // set the marker position
  marker.position.set(pt.x, pt.y, pt.z);

  // get the tangent to the curve
  tangent = path.getTangent(t).normalize();

  // calculate the axis to rotate around
  axis.crossVectors(up, tangent).normalize();

  // calcluate the angle between the up vector and the tangent
  radians = Math.acos(up.dot(tangent));

  // set the quaternion
  marker.quaternion.setFromAxisAngle(axis, radians);

  t = t >= 1 ? 0 : (t += 0.002);

  renderer.render(scene, camera);
}

init();
animate();
