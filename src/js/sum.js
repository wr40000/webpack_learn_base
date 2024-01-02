import { terraria } from "./public";

export default function sum(...args) {
  terraria();
  return args.reduce((p, c) => p + c, 0);
}
