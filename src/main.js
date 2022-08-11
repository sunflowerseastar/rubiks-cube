import { Cube } from "./Cube/Cube.js";
import { centerIndexes, rotationKeys } from "./Cube/constants.js";

const reset = () => {
  const wrapper = document.querySelector("#scene-wrapper");
  const container = document.querySelector("#scene-container");
  wrapper.removeChild(container);

  const el = document.createElement("div");
  el.id = "scene-container";
  wrapper.appendChild(el);

  const cube = new Cube(el);
  cube.start();
};

function main() {
  const wrapper = document.querySelector("#scene-wrapper");
  const container = document.querySelector("#scene-container");
  const cube = new Cube(container);
  cube.start();

  const scramble = () => {
    for (let i = 0; i < 25; i++) {
      cube.rotateRandom();
    }
  };

  // keypress handling
  const onKeypress = (e) => {
    if (rotationKeys.includes(e.key)) {
      cube.rotate(e.key);
    } else if (e.keyCode === 32) {
      // spacebar for random rotation
      cube.rotateRandom();
    } else if (e.key === "s") {
      scramble();
    } else if (e.key === "q") {
      reset();
    }
  };
  window.addEventListener("keypress", onKeypress);

  // click handling
  document
    .getElementById("random")
    .addEventListener("click", cube.rotateRandom);
  document.getElementById("scramble").addEventListener("click", scramble);
  [...document.querySelectorAll(".rotate-btn")].forEach((el) =>
    el.addEventListener("click", () => cube.rotate(el.id))
  );

  document.getElementById("reset").addEventListener("click", reset);
}

main();
