import { getID } from "@/src/EffectnodeGUI/utils/getID";
import { myWins } from "@/src/EffectnodeGUI/utils/myApps";
import {
  Box,
  Center,
  DragControls,
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

function Content({ useStore }) {
  let wins = useStore((r) => r.wins);
  let editorAPI = useStore((r) => r.editorAPI);
  let graph = useStore((r) => r.graph);
  let nodes = graph.nodes || [];
  let edges = graph.edges || [];
  let graphCursorState = useStore((r) => r.graphCursorState);
  let controls = useThree((r) => r.controls);
  let scene = useThree((r) => r.scene);
  //
  //

  return (
    <>
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
        onPointerUp={({ point }) => {
          if (graphCursorState.isDown) {
            graphCursorState.isDown = false;
            controls.enabled = true;

            useStore.setState({
              graphCursorState: {
                ...graphCursorState,
              },
            });
          }
        }}
        onPointerMove={({ point }) => {
          //
          if (graphCursorState.isDown) {
            if (graphCursorState.func === "moveNode") {
              //
              graphCursorState.now.copy(point);
              graphCursorState.delta.copy(point).sub(graphCursorState.last);
              graphCursorState.last.copy(point);
              graphCursorState.delta.y = 0;
              graphCursorState.accu.add(graphCursorState.delta);

              let objectGroup = scene.getObjectByName(graphCursorState.nodeID);
              if (objectGroup) {
                graphCursorState.delta.y = 0;
                objectGroup.position.add(graphCursorState.delta);
                let node = nodes.find((r) => r._id === graphCursorState.nodeID);
                node.position = objectGroup.position.toArray();
              }
            }

            //
          }
        }}
        //
        args={[100000000000000000, 0.15, 100000000000000000]}
        position={[0, -0.15, 0]}
      >
        <meshBasicMaterial visible={false}></meshBasicMaterial>
      </Box>

      {nodes.map((n) => {
        return (
          <group
            name={n._id}
            userData={{
              type: "nodeGroup",
            }}
            position={n.position}
            key={n._id}
          >
            <RoundedBox
              //
              onPointerUp={({ point }) => {
                //
                let time = performance.now();
                let diff = time - graphCursorState.timer;
                //
                let dist = graphCursorState.ts.distanceTo(point);

                if (diff <= 250 && dist <= 1) {
                  //

                  if (!wins.some((r) => r.appID === n._id)) {
                    let win = JSON.parse(
                      JSON.stringify(myWins.find((r) => r.type === "coder"))
                    );
                    win._id = getID();
                    win.appID = n._id;
                    win.nodeID = n._id;
                    win.title = "🧑🏼‍💻 " + n.title;
                    wins.push(win);

                    editorAPI.upWindow({ win });

                    useStore.setState({
                      wins: [...wins],
                    });
                  } else {
                    let win = wins.find((r) => r.appID === n._id);
                    //
                    win.title = "🧑🏼‍💻 " + n.title;
                    win.nodeID = n._id;
                    editorAPI.upWindow({ win });

                    useStore.setState({
                      wins: [...wins],
                    });
                    //
                  }

                  //
                  //
                }
              }}
              onPointerDown={({ point }) => {
                //
                graphCursorState.nodeID = n._id;
                graphCursorState.isDown = true;
                graphCursorState.func = "moveNode";
                graphCursorState.ts.copy(point);
                graphCursorState.now.copy(point);
                graphCursorState.last.copy(point);
                graphCursorState.timer = performance.now();
                controls.enabled = false;
                graphCursorState.accu.set(0, 0, 0);

                //
                useStore.setState({
                  graphCursorState: {
                    ...graphCursorState,
                  },
                });
              }}
              onPointerOver={() => {
                document.body.style.cursor = "pointer";
              }}
              userData={{
                type: "box",
              }}
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
                roughness={0.3}
                metalness={0.8}
                color={"#cccccc"}
              ></meshStandardMaterial>
            </RoundedBox>
            <Text
              userData={{
                type: "text",
              }}
              position={[0, 0.15 + 0.15, 0.0]}
              rotation={[Math.PI * -0.5, 0, 0]}
              fontSize={0.125}
              outlineWidth={0.005}
              outlineColor={"white"}
              color={"black"}
              textAlign="center"
            >
              {n.title}
            </Text>
          </group>
        );
      })}

      <group></group>
    </>
  );
}
export function EditorCanvas({ useStore }) {
  let zoom = 1;
  //
  return (
    <>
      <div
        className="w-full h-full"
        onPointerLeave={() => {
          let st = useStore.getState().graphCursorState;
          st.isDown = false;

          if (st.controls) {
            st.controls.enabled = true;
          }

          useStore.setState({
            graphCursorState: {
              ...st,
            },
          });
        }}
      >
        <Canvas>
          <PerspectiveCamera
            makeDefault
            position={[0, 3.5 * zoom, 0 * zoom]}
          ></PerspectiveCamera>

          <Grid
            followCamera
            infiniteGrid
            sectionSize={10}
            args={[1000, 1000]}
          ></Grid>

          <InstallToStore useStore={useStore}></InstallToStore>

          <Content useStore={useStore}></Content>

          <ambientLight args={[0xffffff, 10]}></ambientLight>
          <Environment files={hdr}></Environment>

          <MapControls
            makeDefault
            object-position={[0, 3.5 * zoom, 0 * zoom]}
            target={[0, 0, 0]}
          ></MapControls>
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
