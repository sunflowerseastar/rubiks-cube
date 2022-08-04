import { AxesHelper } from "three";

import { createCamera } from "./components/camera.js";
import { createCubies } from "./components/cubies.js";
import { createScene } from "./components/scene.js";

import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./Loop.js";
import { indexOfClosestFaceCenterCubie } from "./utilities.js";

let camera;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();

    const cubiesMeshes = createCubies();
    // console.log('cubiesMeshes', cubiesMeshes);

    cubiesMeshes.forEach((cubieMesh) => {
      scene.add(cubieMesh);
    });

    loop = new Loop(camera, scene, renderer, cubiesMeshes);
    container.append(renderer.domElement);

    scene.add(new AxesHelper(500));

    const resizer = new Resizer(container, camera, renderer);

    const testKeypressSpaceFront = (e) => {
      // 32 is 'SPC', 102 is 'f', 70 is 'F'
      // console.log("e.keyCode", e.keyCode);
      if (e.keyCode === 32 || e.keyCode === 102 || e.keyCode === 70) {
        const centerCubieIndex = indexOfClosestFaceCenterCubie(
          cubiesMeshes,
          camera
        );

        const userRotation = {
          centerCubieIndex,
          isCounterClockwise: e.shiftKey, // as in, 'f' is forward, 'F' is backward
        };

        loop.addUserRotationToQueue(userRotation);

        // DEV - use to 'start/stop' a rotation
        // if (loop.userRotationQueue.length) {
        //   loop.popUserRotationQueue();
        // } else {
        //   loop.addUserRotationToQueue(userRotation);
        // }
      }
    };
    window.addEventListener("keypress", testKeypressSpaceFront);
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
