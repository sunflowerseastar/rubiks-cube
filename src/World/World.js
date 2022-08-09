import { createCamera } from "./components/camera.js";
import { createCubies } from "./components/cubies.js";
import { createScene } from "./components/scene.js";

import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./Loop.js";
import {
  indexOfClosestFaceCenterCubie,
  relativeRotationFace,
} from "./utilities.js";
import { centerIndexes, rotationKeys } from "./constants.js";

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

    const resizer = new Resizer(container, camera, renderer);

    const onKeypress = (e) => {
      if (rotationKeys.includes(e.key)) {
        const centerCubieIndex = indexOfClosestFaceCenterCubie(
          cubiesMeshes,
          camera
        );

        const userRotation = {
          // keyCodes below 97 are uppercase, and
          // ex. 'f' is clockwise, 'F' is counter-clockwise
          isCounterClockwise: e.keyCode < 97,
          centerCubieIndex: relativeRotationFace(e.key, centerCubieIndex),
        };

        loop.userRotationQueueEnqueue(userRotation);
      } else if (e.keyCode === 32) {
        // spacebar for random rotation
        loop.userRotationQueueEnqueue({
          isCounterClockwise: Math.random() >= 0.5,
          centerCubieIndex: centerIndexes[Math.floor(Math.random() * 6)],
        });
      }
    };
    window.addEventListener("keypress", onKeypress);
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
