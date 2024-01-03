import { terraria } from "./public";
import { vec3 } from "gl-matrix";

export default function count(x, y) {
  terraria();
  console.log("vec3--count", vec3.create());
  return x - y;
}
