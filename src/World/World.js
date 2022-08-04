import { createCamera } from './components/camera.js';
import { createCubies } from './components/cubies.js';
import { createScene } from './components/scene.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

let camera;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const cubiesMeshes = createCubies();
    // console.log('cubiesMeshes', cubiesMeshes);

    cubiesMeshes.forEach((cubieMesh) => {
      scene.add(cubieMesh);
    });

    const resizer = new Resizer(container, camera, renderer);

    const testKeypressSpaceFront = (e) => {
      if (e.keyCode === 32 || e.keyCode === 102) {
        // FRONT ROTATION
        console.log('space or f, rotate front');

        // user wants to rotate front

        const userRotation = {
          faceToRotate: 3, // TODO figure out A) type/data, and B) how to figure out which face
          isClockwise: true,
        };

        // add 'f' to rotationQueue
        loop.addUserRotationToQueue(userRotation);
      }
    };
    window.addEventListener('keypress', testKeypressSpaceFront);
  }

  render() {
    renderer.render(scene, camera);
  }
  start() {
    loop.start();
  }
  stop() {
    loop.stop();
  }
}

export { World };
