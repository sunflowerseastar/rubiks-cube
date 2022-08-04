import {
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
} from 'three';

const cubieEdgeSize = 100;
const gapSize = 30;
const halfway = (cubieEdgeSize + gapSize) / 2;
const cubieSizePlusGapSize = cubieEdgeSize + gapSize;

const posLeft = (cubieEdgeSize + gapSize) * -1;
const posRight = cubieEdgeSize + gapSize;
const posCenter = 0;

const lcr = [posLeft, posCenter, posRight];

function createCubies() {
  const cubieGeometry = new BoxGeometry(100, 100, 100).toNonIndexed();
  const altCubieGeometry = new BoxGeometry(100, 100, 100).toNonIndexed();
  const material = new MeshBasicMaterial({ vertexColors: true });

  // put all 6 colors on every cubie, 1 per face
  const baseColors = [
    0xff8c94, // red
    0xffd3ad, // orange
    0x91cdf2, // blue
    0xb1e597, // green
    0xeeeeee, // white
    0xfaedb9, // yellow
  ];
  const color = new Color();
  let colors = [];
  const positionAttribute = cubieGeometry.getAttribute('position');
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
  cubieGeometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

  // construct a doubly nested array `cubies` with all cubie positions
  let cubies = [];
  for (let i = 0; i < lcr.length; i += 1) {
    let layer = [];
    for (let j = 0; j < lcr.length; j += 1) {
      let row = [];
      for (let k = 0; k < lcr.length; k += 1) {
        row.push({
          x: lcr[i],
          y: lcr[j],
          z: lcr[k],
        });
      }
      layer.push(row);
    }
    cubies.push(layer);
  }
  console.log('cubies', cubies);

  let cubiesMeshes = [];
  for (let i = 0; i < cubies.length; i += 1) {
    for (let j = 0; j < cubies.length; j += 1) {
      for (let k = 0; k < cubies.length; k += 1) {
        let cubie;
        if (i === 0 && j === 0 && k === 0) {
          console.log('yep!');

          let altColors = [];
          for (let i = 0; i < positionAttribute.count; i += 6) {
            const randomColor = 0xffffff * Math.random();
            color.setHex(randomColor);
            altColors.push(color.r, color.g, color.b);
            altColors.push(color.r, color.g, color.b);
            altColors.push(color.r, color.g, color.b);
            altColors.push(color.r, color.g, color.b);
            altColors.push(color.r, color.g, color.b);
            altColors.push(color.r, color.g, color.b);
          }
          altCubieGeometry.setAttribute(
            'color',
            new Float32BufferAttribute(altColors, 3)
          );

          cubie = new Mesh(altCubieGeometry, material);
        } else {
          cubieGeometry.setAttribute(
            'color',
            new Float32BufferAttribute(colors, 3)
          );

          cubie = new Mesh(cubieGeometry, material);
        }
        cubie.position.x = cubies[i][j][k].x;
        cubie.position.y = cubies[i][j][k].y;
        cubie.position.z = cubies[i][j][k].z;

        cubiesMeshes.push(cubie);
      }
    }
  }

  return cubiesMeshes;
}

export { createCubies };
