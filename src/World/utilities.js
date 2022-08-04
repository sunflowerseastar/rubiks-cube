import { Vector3 } from "three";

export const rotateBackward = (arr) => [...arr.slice(1, arr.length), arr[0]];
export const rotateForward = (arr) => [
  arr[arr.length - 1],
  ...arr.slice(0, arr.length - 1),
];
export const round25 = (x) => (Math.round(x * 4) / 4).toFixed(2) * 1.0;

export const createUp = (axis, sign) =>
new Vector3(
  sign * (axis === "x" ? 1 : 0),
  sign * (axis === "y" ? 1 : 0),
  sign * (axis === "z" ? 1 : 0)
);

export const up11 = (x,y) =>
  new Vector3(
    sign * (axis === "x" ? 1 : 0),
    sign * (axis === "y" ? 1 : 0),
    sign * (axis === "z" ? 1 : 0)
  );

export const otherTwoAxes = (axis) =>
  axis === "x" ? ["y", "z"] : axis === "y" ? ["x", "z"] : ["y", "x"];

// Find the face to rotate by measuring the distance between the camera
// and all of the center cubies. The closest center cubie to the camera
// represents the face to rotate.
export const indexOfClosestFaceCenterCubie = (cubiesMeshes, camera) =>
  cubiesMeshes
    .reduce(
      (acc, c, i) =>
        c.isCenterCubie
          ? [
              ...acc,
              {
                d: camera.position.distanceTo(c.position),
                i,
              },
            ]
          : acc,
      []
    )
    .sort((a, b) => a.d - b.d)[0].i;
