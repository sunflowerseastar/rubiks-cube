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

export const up11 = (x, y) =>
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

// [ 0,  1,  2,  3]
// [14, 22, 12,  4]
// [ F,  R,  B,  L]
const frblCenters = [14, 22, 12, 4];
const frblAdjustments = ["f", "r", "b", "l"];
export const relativeRotationFace = (rotationKey, center) => {
  const rotationKeyLower = rotationKey.toLowerCase();
  if (frblCenters.includes(center)) {
    // f r b l
    if (rotationKeyLower === "u") {
      return 16;
    } else if (rotationKeyLower === "d") {
      return 10;
    } else {
      const centerIndex = frblCenters.indexOf(center);
      const indexAdjustment = frblAdjustments.indexOf(rotationKeyLower);
      const newIndex = (centerIndex + indexAdjustment) % 4;
      return frblCenters[newIndex];
    }
  } else if (center === 16) {
    // up
    // TODO finish up/down rotation face selection logic
    switch (rotationKeyLower) {
      case "f":
        return 16;
      case "b":
        return 10;
      case "l":
        return 4;
      case "r":
        return 22;
      case "u":
        return 12;
      case "d":
        return 14;
    }
  } else {
    // down
    switch (rotationKeyLower) {
      case "f":
        return 10;
      case "b":
        return 16;
      case "l":
        return 4;
      case "r":
        return 22;
      case "u":
        return 14;
      case "d":
        return 12;
    }
  }
};
