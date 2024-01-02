import count from "./js/count";
import sum from "./js/sum";
import { vec3 } from "gl-matrix";

import "./style/index.css";
import "./styl/index.styl";
import "./less/index.less";
import "./sass/index.scss";

import "./style/iconfont.css";

const box2 = document.getElementsByClassName(".box2");
box2.onclick = () => {
  // eslint会对动态导入语法报错，需要修改eslint配置文件
  // webpackChunkName: "math"：这是webpack动态导入模块命名的方式
  // "math"将来就会作为[name]的值显示。
  import(/* webpackChunkName: "sum" */ "./js/sum.js").then((res) => {
    console.log(res);
  });
};
console.log("vec3", vec3.create());
console.log(count(10, 5));

let ter = 10;
for (let i = 5; i >= 0; i--) {
  ter--;
  console.log(ter);
}
