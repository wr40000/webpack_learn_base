import { terraria } from "./public";
import count from './count'
import {add, mul} from './math.js'

export function sum(...args) {
  terraria();
  console.log(count(5,555));
  console.log("runTimeChunk");
  return args.reduce((p, c) => p + c, 0);
}
// export const sum = function(...args) {
//   terraria();
//   console.log(count(5,555));
//   return args.reduce((p, c) => p + c, 0);
// }

add(5,22)
mul(5,22)
