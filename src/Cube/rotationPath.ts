import { Axis } from "./constants";

class RotationPath extends THREE.Curve<THREE.Vector> {
  radius: number;
  xyz: Axis;
  sign: number;
  axisDistance: number;

  constructor(radius: number, xyz: Axis = "z", sign = 1, axisDistance: number) {
    super();
    this.axisDistance = axisDistance ? axisDistance : radius;
    this.radius = radius;
    this.xyz = xyz;
    this.sign = sign;
  }

  getPoint(t: number) {
    const radians = 2 * Math.PI * t;

    return this.xyz === "x"
      ? new THREE.Vector3(
          this.axisDistance * this.sign,
          this.radius * Math.sin(radians),
          -this.radius * Math.cos(radians) * this.sign
        )
      : this.xyz === "y"
      ? new THREE.Vector3(
          this.radius * Math.cos(radians) * this.sign,
          this.axisDistance * this.sign,
          -this.radius * Math.sin(radians)
        )
      : new THREE.Vector3(
          this.radius * Math.cos(radians) * this.sign,
          this.radius * Math.sin(radians),
          this.axisDistance * this.sign
        );
  }
}

export { RotationPath };
