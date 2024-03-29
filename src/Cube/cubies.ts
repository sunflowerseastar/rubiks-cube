import { cubieEdgeSize, gapSize } from "./constants";

const posLeft = (cubieEdgeSize + gapSize) * -1;
const posRight = cubieEdgeSize + gapSize;
const posCenter = 0;

const lcr = [posLeft, posCenter, posRight];

export type Cubie = THREE.Mesh & {
  isCenterCubie?: boolean;
  cubieIndex?: number;
  location?: number;
};
export type CubiesMeshes = Cubie[];
function createCubies(): CubiesMeshes {
  const cubieGeometry = new THREE.BoxGeometry(
    cubieEdgeSize,
    cubieEdgeSize,
    cubieEdgeSize,
  ).toNonIndexed();
  const altCubieGeometry = new THREE.BoxGeometry(
    cubieEdgeSize,
    cubieEdgeSize,
    cubieEdgeSize,
  ).toNonIndexed();
  const material = new THREE.MeshBasicMaterial({ vertexColors: true });
  const altMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

  // put all 6 colors on every cubie, 1 per face
  const baseColors = [
    0xff8c94, // red
    0xffd3ad, // orange
    0x91cdf2, // blue
    0xb1e597, // green
    0xeeeeee, // white
    0xfaedb9, // yellow
  ];
  const color = new THREE.Color();
  let colors = [];
  const positionAttribute = cubieGeometry.getAttribute("position");
  for (let i = 0; i < positionAttribute.count; i += 6) {
    const baseColorIndex = Math.floor(i / 6);
    color.setHex(baseColors[baseColorIndex]);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
  }
  cubieGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3),
  );

  // construct a doubly nested array `cubies` with all cubie positions
  let cubies = [];
  let cubieIndex = 0;
  const centerCubieIndexes = [4, 10, 12, 14, 16, 22];

  for (let i = 0; i < lcr.length; i += 1) {
    let layer = [];
    for (let j = 0; j < lcr.length; j += 1) {
      let row = [];
      for (let k = 0; k < lcr.length; k += 1) {
        row.push({
          x: lcr[i],
          y: lcr[j],
          z: lcr[k],
          cubieIndex,
          isCenterCubie: centerCubieIndexes.includes(cubieIndex),
        });
        cubieIndex += 1;
      }
      layer.push(row);
    }
    cubies.push(layer);
  }

  let cubiesMeshes = [];
  let cubieIndex2 = 0;
  for (let i = 0; i < cubies.length; i += 1) {
    for (let j = 0; j < cubies.length; j += 1) {
      for (let k = 0; k < cubies.length; k += 1) {
        let cubie: Cubie;

        altCubieGeometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(colors, 3),
        );

        if (cubieIndex2 === 23) {
          // DEV - highlight a specific cubie
          // let altColors = [];
          // for (let i = 0; i < positionAttribute.count; i += 6) {
          //   const randomColor = 0xffffff * Math.random();
          //   color.setHex(randomColor);
          //   altColors.push(color.r, color.g, color.b);
          //   altColors.push(color.r, color.g, color.b);
          //   altColors.push(color.r, color.g, color.b);
          //   altColors.push(color.r, color.g, color.b);
          //   altColors.push(color.r, color.g, color.b);
          //   altColors.push(color.r, color.g, color.b);
          // }
          // altCubieGeometry.setAttribute(
          //   "color",
          //   new THREE.Float32BufferAttribute(altColors, 3)
          // );

          cubie = new THREE.Mesh(altCubieGeometry, altMaterial);
        } else {
          // DEV - dim all other cubies
          // material.opacity = 0.1;
          // material.transparent = true;

          cubie = new THREE.Mesh(cubieGeometry, material);
        }
        cubie.position.x = cubies[i][j][k].x;
        cubie.position.y = cubies[i][j][k].y;
        cubie.position.z = cubies[i][j][k].z;
        cubie.isCenterCubie = cubies[i][j][k].isCenterCubie;
        // cubieIndex is the original location, and never changes
        cubie.cubieIndex = cubies[i][j][k].cubieIndex;
        // location is mutated over time, and represents where the cubie is now
        cubie.location = cubies[i][j][k].cubieIndex;

        cubiesMeshes.push(cubie);

        cubieIndex2 += 1;
      }
    }
  }

  return cubiesMeshes;
}

export { createCubies };
