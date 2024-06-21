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
import { Canvas, useThree } from "@react-three/fiber";
import hdr from "public/hdr/studiolighting.hdr";
import { useEffect } from "react";

function InstallToStore({ useStore }) {
  let camera = useThree((r) => r.camera);
  useEffect(() => {
    useStore.setState({
      //
      camera: camera,
    });
  }, [camera, useStore]);

  let scene = useThree((r) => r.scene);
  useEffect(() => {
    useStore.setState({
      //
      scene: scene,
    });
  }, [scene, useStore]);

  let raycaster = useThree((r) => r.raycaster);
  useEffect(() => {
    useStore.setState({
      //
      raycaster: raycaster,
    });
  }, [raycaster, useStore]);

  let mouse = useThree((r) => r.mouse);
  useEffect(() => {
    useStore.setState({
      //
      mouse: mouse,
    });
  }, [mouse, useStore]);

  let pointer = useThree((r) => r.pointer);
  useEffect(() => {
    useStore.setState({
      //
      pointer: pointer,
    });
  }, [pointer, useStore]);
  return null;
}

export function EditorCanvas({ useStore }) {
  let zoom = 1;
  return (
    <>
      <div className="w-full h-full">
        <Canvas>
          <PerspectiveCamera
            makeDefault
            position={[0, 3.5 * zoom, 0 * zoom]}
          ></PerspectiveCamera>

          <MapControls
            makeDefault
            object-position={[0, 3.5 * zoom, 0 * zoom]}
            target={[0, 0, 0]}
          ></MapControls>

          <Grid
            followCamera
            infiniteGrid
            sectionSize={10}
            args={[1000, 1000]}
          ></Grid>

          <InstallToStore useStore={useStore}></InstallToStore>

          <Box
            name="floor"
            //
            onPointerEnter={() => {
              document.body.style.cursor = "pointer";
            }}
            //
            onPointerLeave={() => {
              document.body.style.cursor = "";
            }}
            //
            args={[100000000000000000, 0.15, 100000000000000000]}
            position={[0, -0.15, 0]}
          >
            <meshBasicMaterial
              //
              visible={false}
            ></meshBasicMaterial>
          </Box>

          {/* <Box
            //
            onPointerEnter={() => {
              document.body.style.cursor = "pointer";
            }}
            //
            onPointerLeave={() => {
              document.body.style.cursor = "";
            }}
            //
            args={[1, 0.15, 1]}
            position={[0, 0.15, 0]}
          >
            <meshStandardMaterial
              color={"#ffffff"}
              emissive={"#777"}
              metalness={1}
              roughness={0.5}
            ></meshStandardMaterial>
          </Box>

          <Text
            position={[0, 0.15 + 0.15, 0.4]}
            rotation={[Math.PI * -0.5, 0, 0]}
            fontSize={0.125}
            outlineWidth={0.005}
            outlineColor={"white"}
            color={"black"}
            textAlign="center"
          >
            Create Item
          </Text> */}

          <ambientLight args={[0xffffff, 10]}></ambientLight>
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
