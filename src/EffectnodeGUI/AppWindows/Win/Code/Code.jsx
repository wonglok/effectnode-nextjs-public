import Editor from "@monaco-editor/react";
import { useEffect } from "react";

export function Code({ win, useStore }) {
  let wins = useStore((r) => r.wins);
  let graph = useStore((r) => r.graph);
  let codes = useStore((r) => r.codes);
  let nodes = graph.nodes;
  let node = nodes.find((r) => r._id === win.nodeID);
  let code = codes.find((r) => r.nodeID === win.nodeID);

  let spaceID = useStore((r) => r.spaceID);

  useEffect(() => {
    if (!spaceID) {
      return;
    }

    if (!win.nodeID) {
      return;
    }
  }, [code, spaceID, useStore, win.nodeID]);
  /*
  editor-save
  */
  return (
    <>
      <div className="w-full h-full " style={{}}>
        <div
          className="w-full text-sm flex items-center  bg-gray-200  border-b border-gray-400"
          style={{ height: "30px" }}
        >
          <span
            className="mx-2 underline"
            onClick={() => {
              //
              //   console.log(newTitle);
              //

              let newTitle = prompt(
                `new title: ${node.title}`,
                `${node.title}`
              );

              node.title = newTitle;
              win.title = `🧑🏼‍💻 ${newTitle}`;

              useStore.setState({
                wins: [...wins],
              });
            }}
          >
            Rename Title
          </span>
          <span
            className="mx-2 underline text-red-500"
            onClick={() => {
              //
              if (prompt(`remove "${node.title}" ?`, "no") === "yes") {
                graph.nodes = graph.nodes.filter((r) => r._id !== win.nodeID);
                useStore.setState({
                  graph: {
                    ...graph,
                  },
                  codes: codes.filter((r) => r.nodeID !== win.nodeID),
                  wins: wins.filter((r) => r._id !== win._id),
                });
              }
              //
            }}
          >
            Remove Node
          </span>
        </div>
        <div className="w-full " style={{ height: "calc(100% - 30px)" }}>
          <div
            onKeyDownCapture={(ev) => {
              if (ev.metaKey && ev.key === "s") {
                ev.preventDefault();
                ev.stopPropagation();

                window.dispatchEvent(
                  new CustomEvent("editor-save", {
                    detail: { win, node, code },
                  })
                );
              }
            }}
            className="w-full h-full overflow-hidden rounded-md"
          >
            {code && (
              <Editor
                height={`100%`}
                defaultLanguage="javascript"
                defaultValue={code.code}
                onChange={(text) => {
                  code.code = text;

                  useStore.setState({
                    codes: [...codes],
                  });
                }}
              ></Editor>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
