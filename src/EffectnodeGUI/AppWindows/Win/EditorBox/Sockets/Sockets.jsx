import { Box } from "@react-three/drei";
import { SocketOne } from "./SocketOne";

export function SocketInputs({ node, useStore }) {
  let inputs = node.inputs || [];

  return (
    <group position={[-(inputs.length / 2) * (0.2 + 0.1 / 2), 0, -0.65]}>
      {inputs.map((inp, iii) => {
        return (
          <group key={inp._id} position={[iii * (0.2 + 0.1), 0, 0]} scale={0.2}>
            <SocketOne
              node={node}
              useStore={useStore}
              type={"input"}
            ></SocketOne>
          </group>
        );
      })}
    </group>
  );
}

export function SocketOutputs({ node, useStore }) {
  let outputs = node.outputs || [];

  return (
    <group position={[-(outputs.length / 2) * (0.2 + 0.1 / 2), 0, 0.65]}>
      {outputs.map((inp, iii) => {
        return (
          <group key={inp._id} position={[iii * (0.2 + 0.1), 0, 0]} scale={0.2}>
            <SocketOne
              node={node}
              useStore={useStore}
              type={"output"}
            ></SocketOne>
          </group>
        );
      })}
    </group>
  );
}

//

//

//
