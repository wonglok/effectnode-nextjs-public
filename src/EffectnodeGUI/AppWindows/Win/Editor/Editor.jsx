import {
  Box,
  Environment,
  Grid,
  Lightformer,
  MapControls,
  PerspectiveCamera,
  Sphere,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import hdr from "public/hdr/greenwich_park_02_1k.hdr";

export function Editor() {
  return (
    <>
      <div className="w-full h-full">
        <Canvas>
          <PerspectiveCamera
            makeDefault
            position={[0, 8, 10]}
          ></PerspectiveCamera>
          <MapControls
            makeDefault
            object-position={[0, 8, 10]}
            target={[0, 0, 0]}
          ></MapControls>
          <Grid
            followCamera
            infiniteGrid
            sectionSize={10}
            args={[1000, 1000]}
          ></Grid>
          <Sphere>
            <meshStandardMaterial
              metalness={1}
              roughness={0}
            ></meshStandardMaterial>
          </Sphere>
          <Environment files={hdr}></Environment>
        </Canvas>
      </div>
    </>
  );
}

//
