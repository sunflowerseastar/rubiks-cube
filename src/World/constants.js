export const cubieEdgeSize = 90;
export const gapSize = 10;
export const cubieSizePlusGapSize = cubieEdgeSize + gapSize;

// export const rotationSpeed = 0.26;
// export const rotationSpeed = 0.008;
// export const rotationSpeed = 0.003;
// export const rotationSpeed = 0.001;
// export const rotationSpeed = 0.014;
// export const rotationSpeed = 0.02;
export const rotationSpeed = 0.026;

export const rotationKeys = [
  "f",
  "F",
  "l",
  "L",
  "r",
  "R",
  "b",
  "B",
  "u",
  "U",
  "d",
  "D",
];

export const centerIndexes = [10, 4, 14, 22, 16, 12]; // d l f r u b

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
