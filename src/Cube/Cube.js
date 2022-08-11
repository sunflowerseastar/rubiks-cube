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
let cubiesMeshes;

class Cube {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();

    cubiesMeshes = createCubies();
    cubiesMeshes.forEach((cubieMesh) => {
      scene.add(cubieMesh);
    });

    loop = new Loop(camera, scene, renderer, cubiesMeshes);
    container.append(renderer.domElement);

    const resizer = new Resizer(container, camera, renderer);
  }

  rotate(face) {
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
  }

  rotateRandom() {
    loop.userRotationQueueEnqueue({
      isCounterClockwise: Math.random() >= 0.5,
      centerCubieIndex: centerIndexes[Math.floor(Math.random() * 6)],
    });
  }

  start() {
    loop.start();
  }
}

export { Cube };
