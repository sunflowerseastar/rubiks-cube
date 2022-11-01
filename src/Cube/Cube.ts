import { PerspectiveCamera, Scene } from "three";

import { createCamera } from "./threejs-helpers/camera";
import { CubiesMeshes, createCubies } from "./cubies";
import { createScene } from "./threejs-helpers/scene";

import { createRenderer } from "./threejs-helpers/renderer";
import { Loop, UserRotation } from "./Loop";
import {
  indexOfClosestFaceCenterCubie,
  relativeRotationFace,
} from "./utilities";
import { centerIndexes } from "./constants";

let camera: PerspectiveCamera;
let renderer;
let scene: Scene;
let loop: Loop;
let cubiesMeshes: CubiesMeshes;

class Cube {
  constructor(container: HTMLDivElement) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();

    cubiesMeshes = createCubies();
    cubiesMeshes.forEach((cubieMesh) => {
      scene.add(cubieMesh);
    });

    loop = new Loop(camera, scene, renderer, cubiesMeshes);
    container.append(renderer.domElement);
  }

  rotate(face: string) {
    const centerCubieIndex = indexOfClosestFaceCenterCubie(
      cubiesMeshes,
      camera
    );
    const userRotation: UserRotation = {
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
