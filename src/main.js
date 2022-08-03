import {
  AnimationClip,
  AnimationMixer,
  BoxGeometry,
  Clock,
  Color,
  Curve,
  Float32BufferAttribute,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  VectorKeyframeTrack,
  WebGLRenderer,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer;
let controls;
let mixers = [];
let clock;

const cubieEdgeSize = 100;
const gapSize = 30;
const halfway = (cubieEdgeSize + gapSize) / 2;
const cubieSizePlusGapSize = cubieEdgeSize + gapSize;

const posLeft = (cubieEdgeSize + gapSize) * -1;
const posRight = cubieEdgeSize + gapSize;
const posCenter = 0;

const lcr = [posLeft, posCenter, posRight];

var t = 0;
let tangent;
var matrix = new Matrix4();
var up = new Vector3(0, 1, 0);
var axis = new Vector3();

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
    cubieSizePlusGapSize
  );
};

const onKeypress = (e) => {
  // console.log('onKeypress', e.keyCode);
  if (e.keyCode === 70) {
    console.log('F');
  } else if (e.keyCode === 102) {
    console.log('f');
  } else if (e.keyCode === 117) {
    console.log('u');
  } else if (e.keyCode === 85) {
    console.log('U');
  } else if (e.keyCode === 100) {
    console.log('d');
  } else if (e.keyCode === 68) {
    console.log('D');
  } else if (e.keyCode === 98) {
    console.log('b');
  } else if (e.keyCode === 66) {
    console.log('B');
  } else if (e.keyCode === 108) {
    console.log('l');
  } else if (e.keyCode === 76) {
    console.log('L');
  } else if (e.keyCode === 114) {
    console.log('r');
  } else if (e.keyCode === 82) {
    console.log('R');
  }
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};
const render = () => {
  const delta = clock.getDelta();

  mixers.forEach((m) => m.update(delta));

  // get front cubies
  // const fronts = scene.children.filter((cubies) => {
  //   // console.log('cubies', cubies);
  //   return cubies.position.z > 0;
  // });
  // const f1 = scene.children[0]; // back - bottom right
  // const f1 = scene.children[1]; // left - bottom middle
  // const f1 = scene.children[2]; // front - bottom left
  // const f1 = scene.children[3]; // back - right middle
  // const f1 = scene.children[4]; // left - center
  // const f1 = scene.children[5]; // front - left middle
  // const f1 = scene.children[6]; // back - top right
  // const f1 = scene.children[7]; // left - top middle
  // const cubie8 = scene.children[8]; // front - top left cubie
  // const cubie9 = scene.children[9]; // back - bottom middle
  // const cubie10 = scene.children[10]; // bottom - center
  // const cubie11 = scene.children[11]; // front - bottom middle
  // const cubie12 = scene.children[12]; // back - center
  // const cubie13 = scene.children[13]; // very center of cube
  // const f1 = scene.children[14]; // front - center
  // const f1 = scene.children[15]; // back - top middle
  // const f1 = scene.children[16]; // top - center
  // const f1 = scene.children[17]; // front - top middle
  // const f1 = scene.children[18]; // back - bottom left
  // const f1 = scene.children[19]; // right - bottom middle
  // const f1 = scene.children[20]; // front - bottom right
  // const f1 = scene.children[21]; // back - left middle
  // const f1 = scene.children[22]; // right - center
  const f1 = scene.children[23]; // front - right middle
  // const f1 = scene.children[24]; // back - top left
  // const f1 = scene.children[25]; // right - top middle
  // const f1 = scene.children[26]; // front - top right

  pt = path.getPoint(t);

  f1.position.set(pt.x, pt.y, pt.z);

  // tangent, axis, angle, quaternion
  tangent = path.getTangent(t).normalize();
  axis.crossVectors(up, tangent).normalize();
  radians = Math.acos(up.dot(tangent));
  f1.quaternion.setFromAxisAngle(axis, radians);

  t = t >= 1 ? 0 : (t += 0.002);

  renderer.render(scene, camera);
};
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  render();
};

const init = () => {
  camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 900;

  scene = new Scene();

  const cubieGeometry = new BoxGeometry(100, 100, 100).toNonIndexed();
  const altCubieGeometry = new BoxGeometry(100, 100, 100).toNonIndexed();
  const material = new MeshBasicMaterial({ vertexColors: true });
  const positionAttribute = cubieGeometry.getAttribute('position');

  // put all 6 colors on every cubie, 1 per face
  const baseColors = [
    0xff8c94, // red
    0xffd3ad, // orange
    0x91cdf2, // blue
    0xb1e597, // green
    0xeeeeee, // white
    0xfaedb9, // yellow
  ];
  const color = new Color();
  let colors = [];
  for (let i = 0; i < positionAttribute.count; i += 6) {
    const baseColorIndex = Math.floor(i / 6);
    color.setHex(baseColors[baseColorIndex]);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
  }
  cubieGeometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

  // construct a doubly nested array `cubies` with all cubie positions
  let cubies = [];
  for (let i = 0; i < lcr.length; i += 1) {
    let layer = [];
    for (let j = 0; j < lcr.length; j += 1) {
      let row = [];
      for (let k = 0; k < lcr.length; k += 1) {
        console.log('i,j,k', i, j, k);
        row.push({
          x: lcr[i],
          y: lcr[j],
          z: lcr[k],
        });
      }
      layer.push(row);
    }
    cubies.push(layer);
  }
  console.log('cubies', cubies);

  // loop through all the cubies, position them, and add to scene
  for (let i = 0; i < cubies.length; i += 1) {
    for (let j = 0; j < cubies.length; j += 1) {
      for (let k = 0; k < cubies.length; k += 1) {
        let cubie;
        if (i === 0 && j === 0 && k === 0) {
          console.log('yep!');

          let altColors = [];
          for (let i = 0; i < positionAttribute.count; i += 6) {
            const randomColor = 0xffffff * Math.random();
            color.setHex(randomColor);
            altColors.push(color.r, color.g, color.b);
            altColors.push(color.r, color.g, color.b);
            altColors.push(color.r, color.g, color.b);
            altColors.push(color.r, color.g, color.b);
            altColors.push(color.r, color.g, color.b);
            altColors.push(color.r, color.g, color.b);
          }
          altCubieGeometry.setAttribute(
            'color',
            new Float32BufferAttribute(altColors, 3)
          );

          cubie = new Mesh(altCubieGeometry, material);
        } else {
          cubieGeometry.setAttribute(
            'color',
            new Float32BufferAttribute(colors, 3)
          );

          cubie = new Mesh(cubieGeometry, material);
        }
        cubie.position.x = cubies[i][j][k].x;
        cubie.position.y = cubies[i][j][k].y;
        cubie.position.z = cubies[i][j][k].z;

        scene.add(cubie);
      }
    }
  }

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  clock = new Clock();

  window.addEventListener('resize', onWindowResize);

  // animation path
  path = new Ellipse(cubieSizePlusGapSize, cubieSizePlusGapSize);

  // press space or 'f' to get front face clockwise rotation
  // TODO make this work... figure it out
  // TODO then set up other rotations
  const testKeypressSpaceFront = (e) => {
    if (e.keyCode === 32 || e.keyCode === 102) {
      // FRONT ROTATION
      console.log('space or f, rotate front');
    }
  };
  window.addEventListener('keypress', testKeypressSpaceFront);

  // window.addEventListener('keypress', onKeypress);
};

init();
animate();
