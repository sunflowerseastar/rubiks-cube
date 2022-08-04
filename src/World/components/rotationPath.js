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

  // positive x
  // return new Vector3(
  //   this.radius,
  //   this.radius * Math.sin(radians),
  //   -this.radius * Math.cos(radians)
  // );
  // negative x
  // return new Vector3(
  //   -this.radius,
  //   this.radius * Math.sin(radians),
  //   this.radius * Math.cos(radians)
  // );
  // positive z
  // return new Vector3(
  //   this.radius * Math.cos(radians),
  //   this.radius * Math.sin(radians),
  //   this.radius
  // )

  return this.xyz === "x"
    ? new Vector3(
        this.radius * this.sign,
        this.radius * Math.sin(radians),
        -this.radius * Math.cos(radians) * this.sign
      )
    : this.xyz === "y"
    ? new Vector3(
      // TODO y paths for top & bottom faces
        this.radius * Math.cos(radians),
        this.radius,
        this.radius * Math.sin(radians)
      )
    : new Vector3(
        this.radius * Math.cos(radians) * this.sign,
        this.radius * Math.sin(radians),
        this.radius * this.sign
      );
};

export { RotationPath };
