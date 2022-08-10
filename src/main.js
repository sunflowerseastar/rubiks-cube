import { Cube } from "./Cube/Cube.js";

function main() {
  const container = document.querySelector("#scene-container");
  const cube = new Cube(container);
  cube.start();
}

main();
