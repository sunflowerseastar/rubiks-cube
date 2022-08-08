import { Vector3 } from "three";

// this one is for rotationFaceCenterCubie index 14 (white)
const mapCubiesMeshesToFrontRotationArray = {
  0: 8,
  1: 9,
  2: 4,
  3: 10,
  4: 11,
  5: 5,
  6: 12,
  7: 13,
  8: 6,
  9: 14,
  10: 15,
  11: 3,
  12: 16,
  13: 17,
  14: 18,
  15: 19,
  16: 20,
  17: 7,
  18: 21,
  19: 22,
  20: 2,
  21: 23,
  22: 24,
  23: 1,
  24: 25,
  25: 26,
  26: 0,
};

const dummyDuplicate = {
  // front (white)
  edges: [23, 17, 5, 11], // r  t  l  b
  corners: [26, 20, 2, 8], // tr br bl tl
  normal: {
    axis: "z",
    sign: 1,
  },
};

// 'face index' as in, rotation face, aka 'center cubie index'
export const faceIndexToCubieLocationsLookup = {
  4: {
    // left (orange)
    edges: [5, 7, 3, 1], // r  t  l  b
    corners: [8, 2, 0, 6], // tr br bl tl
    normal: {
      axis: "x",
      sign: -1,
    },
  },
  10: {
    // bottom (green)
    edges: [1, 9, 19, 11], // r  t  l  b
    corners: [0, 18, 20, 2], // tr br bl tl
    normal: {
      axis: "y",
      sign: -1,
    },
  },
  12: {
    // back (yellow)
    edges: [3, 15, 21, 9], // r  t  l  b
    corners: [], // tr br bl tl
    normal: {
      axis: "z",
      sign: -1,
    },
  },
  14: {
    // front (white)
    edges: [23, 17, 5, 11], // r  t  l  b
    corners: [26, 20, 2, 8], // tr br bl tl
    normal: {
      axis: "z",
      sign: 1,
    },
  },
  16: {
    // top (blue)
    edges: [25, 15, 7, 17], // r  t  l  b
    corners: [24, 6, 8, 26], // tr br bl tl
    normal: {
      axis: "y",
      sign: 1,
    },
  },
  22: {
    // right (red)
    edges: [21, 25, 23, 19], // r  t  l  b
    corners: [], // tr br bl tl
    normal: {
      axis: "x",
      sign: 1,
    },
  },
};
