import { Axis, Sign } from "./constants";
import { CubiesMeshes } from "./cubies";

type CreateUp = (axis: Axis, sign: Sign) => THREE.Vector3;
export const createUp: CreateUp = (axis, sign) =>
  new THREE.Vector3(
    sign * (axis === "x" ? 1 : 0),
    sign * (axis === "y" ? 1 : 0),
    sign * (axis === "z" ? 1 : 0)
  );

// Find the face to rotate by measuring the distance between the camera and all
// of the center cubies. The closest center cubie to the camera represents the
// face to rotate. The fallback `14` is to appease typescript.
type IndexOfClosestFaceCenterCubie = (
  cubiesMeshes: CubiesMeshes,
  camera: THREE.PerspectiveCamera
) => number;

export const indexOfClosestFaceCenterCubie: IndexOfClosestFaceCenterCubie = (
  cubiesMeshes,
  camera
) =>
  cubiesMeshes
    .filter(({ isCenterCubie }) => isCenterCubie)
    .map(({ position, cubieIndex }) => ({
      d: camera.position.distanceTo(position),
      cubieIndex,
    }))
    .sort((a, b) => a.d - b.d)[0].cubieIndex || 14;

// [ 0,  1,  2,  3]
// [14, 22, 12,  4]
// [ F,  R,  B,  L]
const frblCenters = [14, 22, 12, 4];
const frblAdjustments = ["f", "r", "b", "l"];

type RelativeRotationFace = (rotationKey: string, center: number) => number;

export const relativeRotationFace: RelativeRotationFace = (
  rotationKey,
  center
) => {
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
      default:
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
      default:
        return 12;
    }
  }
};
