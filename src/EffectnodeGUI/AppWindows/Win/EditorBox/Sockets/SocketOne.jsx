import { Box } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function SocketOne({ type, node, useStore }) {
  let graphCursorState = useStore((r) => r.graphCursorState);
  let controls = useThree((s) => s.controls);
  return (
    <>
      <Box
        onPointerDown={({ point }) => {
          //
          graphCursorState.nodeID = node._id;
          graphCursorState.isDown = true;
          graphCursorState.func = "makeEdge";
          graphCursorState.ts.copy(point);
          graphCursorState.now.copy(point);
          graphCursorState.last.copy(point);
          graphCursorState.timer = performance.now();
          graphCursorState.accu.set(0, 0, 0);
          controls.enabled = false;

          useStore.setState({
            graphCursorState: {
              ...graphCursorState,
            },
          });
        }}
      >
        <meshStandardMaterial
          roughness={0.3}
          metalness={0.8}
          color={"#44ffff"}
        ></meshStandardMaterial>
      </Box>
    </>
  );
}
