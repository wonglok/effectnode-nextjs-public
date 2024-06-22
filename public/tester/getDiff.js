// Three.js Transpiler r165

import {
  float,
  min,
  max,
  If,
  tslFn,
  vec3,
  length,
  distance,
  div,
  normalize,
} from "three/nodes";

const constrain = tslFn(([val_immutable, min_immutable, max_immutable]) => {
  const max = float(max_immutable).toVar();
  const min = float(min_immutable).toVar();
  const val = float(val_immutable).toVar();

  const output = float(0.0).toVar();
  If(val.lessThan(min), () => {
    output.assign(min);
  })
    .elseif(val.greaterThan(max), () => {
      output.assign(max);
    })
    .else(() => {
      output.assign(val);
    });

  return output;
});

const getDiff = tslFn(([lastPos_immutable, mousePos_immutable]) => {
  const mousePos = vec3(mousePos_immutable).toVar();
  const lastPos = vec3(lastPos_immutable).toVar();
  const diff = vec3(lastPos.xyz.div(33.3).sub(mousePos)).toVar();
  const distance = float(constrain(length(diff), 5.0, 100.0)).toVar();
  const strength = float(div(0.35, distance.mul(distance))).toVar();
  diff.assign(normalize(diff));
  diff.assign(diff.mul(vec3(strength)).sub(2.0));

  return diff;
});

// layouts

constrain.setLayout({
  name: "constrain",
  type: "float",
  inputs: [
    { name: "val", type: "float" },
    { name: "min", type: "float" },
    { name: "max", type: "float" },
  ],
});

getDiff.setLayout({
  name: "getDiff",
  type: "vec3",
  inputs: [
    { name: "lastPos", type: "vec3", qualifier: "in" },
    { name: "mousePos", type: "vec3", qualifier: "in" },
  ],
});

export { constrain, getDiff };
