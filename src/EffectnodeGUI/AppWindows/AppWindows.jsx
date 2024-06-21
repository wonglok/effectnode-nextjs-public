import { EditorBox } from "./Win/EditorBox/EditorBox";
import { WinGeneric } from "./Win/Generic/WinGeneric";
import { Previewer } from "./Win/Previewer/Previewer";
import { useEffect } from "react";

export function AppWindows({ useStore }) {
  // let apps = useStore((r) => r.apps)
  let wins = useStore((r) => r.wins);

  useEffect(() => {}, []);
  return (
    <>
      {wins.map((win, idx) => {
        // console.log(win.type);
        return (
          <WinGeneric
            idx={idx}
            win={win}
            useStore={useStore}
            topBar={<div>{win.title}</div>}
            key={win._id + "win"}
          >
            {win.type === "editor" && (
              <>
                <EditorBox useStore={useStore}></EditorBox>
              </>
            )}

            {win.type === "previewer" && (
              <>
                <Previewer useStore={useStore}></Previewer>
              </>
            )}
          </WinGeneric>
        );
      })}
    </>
  );
}

//

//

//
