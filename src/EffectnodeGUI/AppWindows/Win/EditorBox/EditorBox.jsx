import { EditorCanvas } from "./EditorCanvas";
// import { getID } from "@/EffectnodeGUI/utils/getID";
// import { myWins } from "@/EffectnodeGUI/utils/myApps";
import { useEffect, useMemo } from "react";
import { Vector3 } from "three";

export function EditorBox({ useStore }) {
  let wins = useStore((r) => r.wins);
  let apps = useStore((r) => r.apps);

  let raycaster = useStore((r) => r.raycaster);
  let pointer = useStore((r) => r.pointer);
  let scene = useStore((r) => r.scene);
  let camera = useStore((r) => r.camera);

  let point3 = useMemo(() => new Vector3(), []);

  useEffect(() => {
    if (!raycaster) {
      return;
    }
    let center = new Vector3(0.0, 0.0);
    let ttt = setInterval(() => {
      raycaster.setFromCamera(center, camera);
      let results =
        raycaster.intersectObject(scene.getObjectByName("floor"), false) || [];
      if (results) {
        let first = results[0];
        if (first) {
          first.point.y = 0;
          //
          // console.log(first.point);
          //
          point3.copy(first.point);
        }
      }
    }, 300);

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
              //
              //
              //
              //
              // let editorApp = apps.find((r) => r.type === "editor");
              // let win = myWins.find(tpye === "coder");
              // win._id = getID();
              // win.appID = editorApp._id;
              // win.data = {
              //   itemID: "",
              // };
              // useStore.setState({
              //   wins: [...wins, win],
              // });
              //
              //
              //
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
