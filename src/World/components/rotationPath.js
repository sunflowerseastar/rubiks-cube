import { Curve, Vector3 } from "three";

function RotationPath(radius, xyz = "z", sign = 1) {
  this.radius = radius;
  this.xyz = xyz;
  this.sign = sign;
}
RotationPath.prototype = Object.create(Curve.prototype);
RotationPath.prototype.constructor = RotationPath;
RotationPath.prototype.getPoint = function (t) {
  const radians = 2 * Math.PI * t;

  return this.xyz === "x"
    ? new Vector3(
        this.radius * this.sign,
        this.radius * Math.sin(radians),
        -this.radius * Math.cos(radians) * this.sign
      )
    : this.xyz === "y"
    ? new Vector3(
        this.radius * Math.cos(radians) * this.sign,
        this.radius * this.sign,
        -this.radius * Math.sin(radians)
      )
    : new Vector3(
        this.radius * Math.cos(radians) * this.sign,
        this.radius * Math.sin(radians),
        this.radius * this.sign
      );
};

export { RotationPath };
