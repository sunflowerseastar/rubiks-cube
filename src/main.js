import {
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer;
let controls;

const cubieEdgeSize = 100;
const gapSize = 8;

const posLeft = (cubieEdgeSize + gapSize) * -1;
const posRight = cubieEdgeSize + gapSize;
const posCenter = 0;

const leftCenterRight = [posLeft, posCenter, posRight];

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
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
};

const init = () => {
  camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 500;

  scene = new Scene();

  const cubieGeometry = new BoxGeometry(100, 100, 100).toNonIndexed();
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
  for (let i = 0; i < leftCenterRight.length; i += 1) {
    let layer = [];
    for (let j = 0; j < leftCenterRight.length; j += 1) {
      let row = [];
      for (let k = 0; k < leftCenterRight.length; k += 1) {
        row.push({
          x: leftCenterRight[i],
          y: leftCenterRight[j],
          z: leftCenterRight[k],
        });
      }
      layer.push(row);
    }
    cubies.push(layer);
  }

  // loop through all the cubies, position them, and add to scene
  for (let i = 0; i < cubies.length; i += 1) {
    for (let j = 0; j < cubies.length; j += 1) {
      for (let k = 0; k < cubies.length; k += 1) {
        let cubie = new Mesh(cubieGeometry, material);
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

  window.addEventListener('resize', onWindowResize);

  window.addEventListener('keypress', onKeypress);
};

init();
animate();
