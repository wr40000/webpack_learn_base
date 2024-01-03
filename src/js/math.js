import count from "./count";

export function add(x, y) {
  count(x, y)
  return x + y;
}

export function mul(x, y) {
  count(x, y)
  return x * y;
}

// export function count(x, y) {
//   return x - y;
// }
