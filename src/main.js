import { vec3 } from "gl-matrix";

import count from "./js/count";
import { add, mul } from "./js/math.js";

import "./style/index.css";
import "./styl/index.styl";
import "./less/index.less";
import "./sass/index.scss";

import "./style/iconfont.css";

const box2 = document.getElementsByClassName("box2")[0];
box2.innerText = "GOOD";
box2.onclick = () => {
  // eslint会对动态导入语法报错，需要修改eslint配置文件
  // webpackChunkName: "sum"：这是webpack动态导入模块命名的方式
  // "sum"将来就会作为[name]的值显示。
  import(/* webpackChunkName: "sum" */ "./js/sum.js").then((module) => {
    console.log("sum-默认暴露", module);
    console.log("sum-Module", module.sum(66, 222));
  });
  // .then(({ sum }) => {
  //   命名暴露;
  //   console.log("sum-Module", sum(66, 222));
  // });

  // CSS 动态导入
  import(/* webpackChunkName: "splitModule" */ "./style/splitModule.css")
    .then(() => {
      console.log("CSS module loaded");
    })
    .catch((error) => {
      console.error("Error loading CSS module:", error);
    });
};
console.log("vec3", vec3.create());
console.log("count", count(10, 5));

let ter = 10;
for (let i = 5; i >= 0; i--) {
  ter--;
  console.log(ter);
}
new Promise((resolve, reject) => {
  resolve("Terraria");
}).then((value) => {
  console.log(value);
});
add("add", 5, 22);
mul("mul", 5, 22);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
