export const cubieEdgeSize = 90;
export const gapSize = 10;
export const cubieSizePlusGapSize = cubieEdgeSize + gapSize;

// export const rotationSpeed = 0.26;
// export const rotationSpeed = 0.008;
// export const rotationSpeed = 0.003;
// export const rotationSpeed = 0.001;
// export const rotationSpeed = 0.014;
// export const rotationSpeed = 0.02;
// export const rotationSpeed = 0.026;
export const rotationSpeed = 0.036;
// export const rotationSpeed = 0.046;

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
export type Axis = "x" | "y" | "z";
export enum Sign {
  NEGATIVE = -1,
  POSITIVE = 1,
}
type Face = {
  edges: number[]; // r  t  l  b
  corners: number[]; // tr tl bl br
  normal: {
    axis: Axis;
    sign: Sign;
  };
};
interface Faces {
  [index: number]: Face;
}
export const faceIndexToCubieLocationsLookup: Faces = {
  4: {
    // left (orange)
    edges: [5, 7, 3, 1], // r  t  l  b
    corners: [8, 6, 0, 2], // tr tl bl br
    normal: {
      axis: "x",
      sign: Sign.NEGATIVE,
    },
  },
  10: {
    // bottom (green)
    edges: [1, 9, 19, 11], // r  t  l  b
    corners: [0, 18, 20, 2], // tr tl bl br
    normal: {
      axis: "y",
      sign: Sign.NEGATIVE,
    },
  },
  12: {
    // back (yellow)
    edges: [3, 15, 21, 9], // r  t  l  b
    corners: [6, 24, 18, 0], // tr tl bl br
    normal: {
      axis: "z",
      sign: Sign.NEGATIVE,
    },
  },
  14: {
    // front (white)
    edges: [23, 17, 5, 11], // r  t  l  b
    corners: [26, 8, 2, 20], // tr tl bl br
    normal: {
      axis: "z",
      sign: Sign.POSITIVE,
    },
  },
  16: {
    // top (blue)
    edges: [25, 15, 7, 17], // r  t  l  b
    corners: [24, 6, 8, 26], // tr tl bl br
    normal: {
      axis: "y",
      sign: Sign.POSITIVE,
    },
  },
  22: {
    // right (red)
    edges: [21, 25, 23, 19], // r  t  l  b
    corners: [24, 26, 20, 18], // tr tl bl br
    normal: {
      axis: "x",
      sign: Sign.POSITIVE,
    },
  },
};
