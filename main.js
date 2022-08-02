import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Scene,
  PerspectiveCamera,
  // TextureLoader,
  WebGLRenderer,
} from 'three';

let camera, scene, renderer;
let cube;

console.log('asdf2');

init();
animate();

function init() {
  camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 400;

  scene = new Scene();

  // const texture = new TextureLoader().load('textures/crate.gif');

  const geometry = new BoxGeometry(200, 200, 200);
  const material = new MeshBasicMaterial( { color: 0x333333 } );

  mesh = new Mesh(geometry, material);
  scene.add(mesh);

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;

  renderer.render(scene, camera);
}
