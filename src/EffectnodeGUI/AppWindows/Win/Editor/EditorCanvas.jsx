import {
  Box,
  Center,
  Environment,
  Grid,
  Lightformer,
  MapControls,
  PerspectiveCamera,
  RoundedBox,
  Sphere,
  Text,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import hdr from "public/hdr/greenwich_park_02_1k.hdr";

export function EditorCanvas() {
  let zoom = 1;
  return (
    <>
      <div className="w-full h-full">
        <Canvas>
          <PerspectiveCamera
            makeDefault
            position={[0, 3.5 * zoom, 3.0 * zoom]}
          ></PerspectiveCamera>

          <MapControls
            makeDefault
            object-position={[0, 3.5 * zoom, 3.0 * zoom]}
            target={[0, 0, 0]}
          ></MapControls>

          <Grid
            followCamera
            infiniteGrid
            sectionSize={2.5}
            args={[1000, 1000]}
          ></Grid>

          <Box args={[1, 0.1, 1]}>
            <meshStandardMaterial
              metalness={1}
              roughness={0.2}
            ></meshStandardMaterial>
          </Box>
          <Text
            position={[0, 0.15, 0.4]}
            rotation={[Math.PI * -0.5, 0, 0]}
            fontSize={0.125}
            outlineWidth={0.005}
            outlineColor={"white"}
            color={"black"}
            textAlign="center"
          >
            Create Object
          </Text>

          <Environment files={hdr}></Environment>
        </Canvas>
      </div>
    </>
  );
}
export function Editor() {
  return (
    <>
      <EditorCanvas></EditorCanvas>
    </>
  );
}

//
