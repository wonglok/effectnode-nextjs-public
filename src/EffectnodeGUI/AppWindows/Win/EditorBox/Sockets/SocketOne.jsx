import { getID } from "@/src/EffectnodeGUI/utils/getID";
import { Box, RoundedBox } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function SocketOne({ type, socket, node, useStore }) {
  let graphCursorState = useStore((r) => r.graphCursorState);
  let controls = useThree((s) => s.controls);
  return (
    <>
      <RoundedBox
        name={socket._id}
        radius={0.5}
        scale={[1, 2, 1]}
        position={[0, 2 / 2, 0]}
        onPointerDown={({ point }) => {
          //
          graphCursorState.nodeID = node._id;
          graphCursorState.isDown = true;
          graphCursorState.func = "createEdge";
          graphCursorState.ts.copy(point);
          graphCursorState.now.copy(point);
          graphCursorState.last.copy(point);
          graphCursorState.timer = performance.now();
          graphCursorState.accu.set(0, 0, 0);
          controls.enabled = false;

          graphCursorState.socketA = socket;

          //
          useStore.setState({
            graphCursorState: {
              ...graphCursorState,
            },
          });
          //

          //

          //
        }}
        onPointerUp={({ point }) => {
          //
          let start = graphCursorState.ts;
          let end = point.end;
          console.log(start, end);

          graphCursorState.socketB = socket;

          let ab = [graphCursorState.socketA, graphCursorState.socketB];
          let hasInput = ab.some((r) => r.type === "input");
          let hasOutput = ab.some((r) => r.type === "output");

          if (hasInput && hasOutput) {
            graphCursorState.inputSocket = [
              graphCursorState.socketA,
              graphCursorState.socketB,
            ].find((r) => r.type === "input");
            graphCursorState.outputSocket = [
              graphCursorState.socketA,
              graphCursorState.socketB,
            ].find((r) => r.type === "output");

            let graph = useStore.getState().graph;

            graph.edges = graph.edges || [];

            graph.edges.push({
              id: getID(),
              input: graphCursorState.inputSocket,
              output: graphCursorState.outputSocket,
            });

            useStore.setState({
              graph: {
                ...graph,
              },
            });
          }
        }}
      >
        <meshStandardMaterial
          roughness={0.3}
          metalness={0.8}
          color={"#44ffff"}
        ></meshStandardMaterial>
      </RoundedBox>
    </>
  );
}
