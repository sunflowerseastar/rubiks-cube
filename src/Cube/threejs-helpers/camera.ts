function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    10000,
  );
  camera.position.z = 900;

  return camera;
}

export { createCamera };
