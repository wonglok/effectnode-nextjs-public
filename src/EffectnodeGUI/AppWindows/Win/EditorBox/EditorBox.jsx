import {
  makeCode,
  makeGraphNode,
} from "@/src/EffectnodeGUI/utils/myGraphNodes";
import { EditorCanvas } from "./EditorCanvas";
// import { getID } from "@/src/EffectnodeGUI/utils/getID";
// import { myWins } from "@/src/EffectnodeGUI/utils/myApps";
import { useEffect, useMemo } from "react";
import { Object3D, Vector3 } from "three";

export function EditorBox({ useStore }) {
  // let wins = useStore((r) => r.wins);
  // let apps = useStore((r) => r.apps);

  let codes = useStore((r) => r.codes) || [];
  let graph = useStore((r) => r.graph);
  let spaceID = useStore((r) => r.spaceID);

  let raycaster = useStore((r) => r.raycaster);
  let pointer = useStore((r) => r.pointer);
  let scene = useStore((r) => r.scene);
  let camera = useStore((r) => r.camera);

  let point3 = useMemo(() => new Vector3(), []);

  useEffect(() => {
    if (!raycaster) {
      return;
    }
    let empty = new Object3D();
    let center = new Vector3(0.0, 0.0);
    let ttt = setInterval(() => {
      raycaster.setFromCamera(center, camera);
      let results =
        raycaster.intersectObject(
          scene.getObjectByName("floor") || empty,
          false
        ) || [];

      if (results) {
        let first = results[0];
        if (first) {
          first.point.y = 0;

          point3.copy(first.point);
        }
      }
    }, 100);

    return () => {
      clearInterval(ttt);
    };
  }, [camera, point3, pointer, raycaster, scene]);

  return (
    <>
      <div className=" absolute top-0 left-0 w-full h-full">
        <div
          className="w-full bg-gray-200 border-b border-gray-400 text-sm flex items-center "
          style={{ height: `calc(25px)` }}
        >
          <span
            className=" underline cursor-pointer px-2"
            onClick={() => {
              let newNode = makeGraphNode({ spaceID: spaceID });
              newNode.position = point3.toArray();

              let newCode = makeCode({
                spaceID,
                nodeID: newNode._id,
              });

              if (graph.nodes.length === 0) {
                newNode.title = "main";
                newCode.title = "main";
              } else {
                let title = window.prompt(
                  "Please name the module...",
                  "newNode"
                );
                if (title) {
                  newNode.title = title;
                  newCode.title = title;
                }
              }

              graph.nodes.push(newNode);
              useStore.setState({
                graph: { ...graph },
                codes: [...codes, newCode],
              });
            }}
          >
            Create Item
          </span>
        </div>
        <div className="w-full" style={{ height: `calc(100% - 25px)` }}>
          <EditorCanvas useStore={useStore}></EditorCanvas>
        </div>
      </div>
    </>
  );
}

//

//

//
