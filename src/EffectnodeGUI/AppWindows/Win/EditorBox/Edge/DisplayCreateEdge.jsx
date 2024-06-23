import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Line2 } from "three/examples/jsm/lines/Line2";

import { CatmullRomCurve3, Color, Vector3 } from "three";
import { useEffect, useMemo, useState } from "react";
// import { Box } from "@react-three/drei";
export function DisplayCreateEdge({ start }) {
  let [end, setEND] = useState([0, 0, 0]);

  useEffect(() => {
    //

    //
    setEND([0, 0, 0]);
    return () => {
      //
    };
  }, []);
  return <RenderLine start={start} end={end}></RenderLine>;
}
export function RenderLine({ start = [1, 0, 1], end = [0, 0, 0] }) {
  //
  const a = useMemo(() => {
    return new Vector3().fromArray(start);
  }, [start]);

  const b = useMemo(() => {
    return new Vector3().fromArray(end);
  }, [end]);
  //
  const mat = useMemo(() => {
    return getMat();
  }, []);

  const geo = useMemo(() => {
    let geo = getGeo({ a, b, dotted: false });

    return geo;
  }, [a, b]);

  const { line, displayLine } = useMemo(() => {
    let line = getLine({ geo, mat });
    let displayLine = <primitive object={line}></primitive>;
    return { line, displayLine };
  }, [geo, mat]);
  //
  //
  return (
    <>
      {/* <Box></Box> */}
      {displayLine}
    </>
  );
}

const getLine = ({ geo, mat }) => {
  let line2 = new Line2(geo, mat);

  line2.computeLineDistances();

  return line2;
};
const getMat = () => {
  const material = new LineMaterial({
    transparent: true,
    color: new Color("#00ffff"),
    linewidth: 0.0015,
    opacity: 1.0,
    dashed: true,
    vertexColors: false,
  });

  return material;
};
const getGeo = ({ a, b, dotted = false }) => {
  const dist = new Vector3().copy(a).distanceTo(b);
  let raise = dist / 1.6;
  if (raise > 500) {
    raise = 500;
  }
  const curvePts = new CatmullRomCurve3(
    [
      new Vector3(a.x, a.y - 1, a.z),
      new Vector3(a.x, a.y - 1 + raise, a.z),
      new Vector3(b.x, b.y - 1 + raise, b.z),
      new Vector3(b.x, b.y - 1, b.z),
    ],
    false
  );

  let lineGeo = new LineGeometry();
  if (dotted) {
    lineGeo = new LineSegmentsGeometry();
  }
  let colors = [];
  let pos = [];
  let count = 100;
  let temp = new Vector3();

  let colorA = new Color();
  let colorB = new Color("#0000ff");

  for (let i = 0; i < count; i++) {
    curvePts.getPointAt((i / count) % 1, temp);
    if (isNaN(temp.x)) {
      temp.x = 0.0;
    }
    if (isNaN(temp.y)) {
      temp.y = 0.0;
    }
    if (isNaN(temp.z)) {
      temp.z = 0.0;
    }
    pos.push(temp.x, temp.y, temp.z);
    colorA.setStyle("#00ff00");
    colorA.lerp(colorB, i / count);

    //
    colorA.offsetHSL(0, 0.5, 0.0);
    colors.push(colorA.r, colorA.g, colorA.b);
  }

  lineGeo.setColors(colors);

  lineGeo.setPositions(pos);
  return lineGeo;
};
