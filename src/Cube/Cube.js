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

class Cube {
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

    const rotate = (face) => {
      const centerCubieIndex = indexOfClosestFaceCenterCubie(
        cubiesMeshes,
        camera
      );

      const userRotation = {
        // ex. 'f' is clockwise, 'F' is counter-clockwise
        isCounterClockwise: face.toUpperCase() === face,
        centerCubieIndex: relativeRotationFace(face, centerCubieIndex),
      };

      loop.userRotationQueueEnqueue(userRotation);
    };

    const rotateRandom = () =>
      loop.userRotationQueueEnqueue({
        isCounterClockwise: Math.random() >= 0.5,
        centerCubieIndex: centerIndexes[Math.floor(Math.random() * 6)],
      });

    const onKeypress = (e) => {
      if (rotationKeys.includes(e.key)) {
        rotate(e.key);
      } else if (e.keyCode === 32) {
        // spacebar for random rotation
        rotateRandom();
      }
    };
    window.addEventListener("keypress", onKeypress);

    document.getElementById("scramble").addEventListener("click", () => {
      for (let i = 0; i < 25; i++) {
        rotateRandom();
      }
    });
    document.getElementById("random").addEventListener("click", rotateRandom);
    [...document.querySelectorAll(".rotate-btn")].forEach((el) =>
      el.addEventListener("click", () => rotate(el.id))
    );
  }

  render() {
    renderer.render(scene, camera);
  }
  start() {
    loop.start();
  }
}

export { Cube };
