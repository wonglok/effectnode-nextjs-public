import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import * as prettier from "prettier/standalone";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import prettierPluginHtml from "prettier/plugins/html";
import { UserInputs } from "./UserInputs/UserInputs";

export function Code({ win, useStore }) {
  let wins = useStore((r) => r.wins);
  let graph = useStore((r) => r.graph);
  let codes = useStore((r) => r.codes);
  let nodes = graph.nodes;
  let node = nodes.find((r) => r._id === win.nodeID);
  let code = codes.find((r) => r.nodeID === win.nodeID);

  let spaceID = useStore((r) => r.spaceID);
  let [editor, setEditor] = useState(false);

  useEffect(() => {
    if (!spaceID) {
      return;
    }
    if (!win.nodeID) {
      return;
    }

    useStore.setState({ showCode: true });
  }, [code, spaceID, useStore, win.nodeID]);

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
              //-

              let newTitle = prompt(
                `new title: ${node.title}`,
                `${node.title}`
              );

              if (newTitle) {
                node.title = newTitle;
                win.title = `🧑🏼‍💻 ${newTitle}`;

                useStore.setState({
                  wins: [...wins],
                });
              }
            }}
          >
            Rename Title
          </span>
          <span
            className="mx-2 underline text-red-500"
            onClick={() => {
              //
              if (prompt(`remove "${node.title}" permanent?`, "no") === "yes") {
                //
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

                let runRun = async () => {
                  let indexPos = editor
                    .getModel()
                    .getOffsetAt(editor.getPosition());

                  let beforePosition = editor.getPosition();

                  let beforeState = editor.saveViewState();
                  // console.log(editor);
                  let result = await prettier.formatWithCursor(code.code, {
                    cursorOffset: indexPos,
                    parser: "babel",
                    plugins: [
                      prettierPluginBabel,
                      prettierPluginEstree,
                      prettierPluginHtml,
                    ],
                  });

                  //
                  // editor.setValue(result.formatted);
                  //
                  editor.setPosition(beforePosition);
                  editor.restoreViewState(beforeState);

                  code.code = result.formatted;

                  useStore.setState({
                    codes: [...codes],
                  });
                };
                runRun();
              }
            }}
            className="w-full h-full overflow-hidden rounded-md"
          >
            <div className="flex w-full h-full">
              <div className="h-full" style={{ width: `calc(100% - 300px)` }}>
                {code && (
                  <Editor
                    height={`100%`}
                    defaultLanguage="javascript"
                    defaultValue={`${code.code}`}
                    onMount={(editor, monaco) => {
                      //
                      setEditor(editor);
                      //
                    }}
                    onChange={(text) => {
                      code.code = text;

                      useStore.setState({
                        codes: [...codes],
                      });
                    }}
                  ></Editor>
                )}
              </div>
              <div
                className="h-full border-l border-gray-400 bg-gray-700"
                style={{ width: `calc(300px)` }}
              >
                {/*  */}

                {code && (
                  <UserInputs
                    useStore={useStore}
                    graph={graph}
                    codes={codes}
                    code={code}
                  ></UserInputs>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
