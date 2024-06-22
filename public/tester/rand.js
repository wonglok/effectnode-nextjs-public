// Three.js Transpiler r165

import { vec2, dot, sin, fract, tslFn } from "three/nodes";

const rand = tslFn(([n_immutable]) => {
  const n = vec2(n_immutable).toVar();

  return fract(sin(dot(n, vec2(12.9898, 4.1414))).mul(43758.5453));
});

// layouts

rand.setLayout({
  name: "rand",
  type: "float",
  inputs: [{ name: "n", type: "vec2" }],
});

export { rand };
