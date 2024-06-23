import { useEffect, useRef, useState } from "react";
import * as React from "react";
import { compileNode } from "./compileNode";
import { create } from "zustand";
export default function FrameRun() {
  let [state, setState] = useState({});

  let [send, setSend] = useState(() => {
    return () => {};
  });

  let readyRef = useRef(false);

  useEffect(() => {
    let url = new URL(location.href);
    let launcher = url.searchParams.get("launcher");

    let send = ({ action = "action", payload = {} }) => {
      return window?.top?.postMessage(
        {
          //
          launcher: launcher,
          action: action,
          payload: payload,
          //
        },
        {
          targetOrigin: `${location.origin}`,
        }
      );
    };
    setSend(() => {
      return send;
    });

    let hh = (ev) => {
      if (ev.data.launcher === launcher && ev.origin === location.origin) {
        let payload = ev.data.payload;
        let action = ev.data.action;

        if (action === "launchApp") {
          setState(payload);
        }
      }
    };
    window.addEventListener("message", hh);

    if (!readyRef.current) {
      readyRef.current = true;
      send({ action: "ready", payload: {} });
    }

    return () => {
      window.removeEventListener("message", hh);
    };
  }, []);

  // useEffect(() => {
  //   let { graph, codes } = state;

  //   if (!codes) {
  //     return;
  //   }

  //   // getCompile({
  //   //   graph,
  //   //   codes,
  //   // }).then((mod) => {
  //   //   //
  //   //   console.log(mod);
  //   // });

  //   return () => {
  //     //
  //     //
  //   };
  // }, [state]);

  //

  let { graph, codes } = state;

  let useCore = React.useMemo(() => {
    if (!graph) {
      return false;
    }
    return create(() => {
      return {
        graph,
        nodes: graph.nodes,
        edges: graph.edges,
        codes,
      };
    });
  }, [codes, graph]);

  useEffect(() => {
    if (!useCore) {
      return;
    }
    return useCore.subscribe((now, before) => {
      console.log(now, before);
    });
  }, [useCore]);

  return (
    <>
      {/* {
        graph &&
        graph.nodes.map((n) => {
          let code = codes.find((r) => r.nodeID === n._id);
          return <NodeRunner code={code} node={n} key={n._id}></NodeRunner>;
        })} */}

      {graph && useCore && (
        <>
          {/*  */}

          {graph.nodes.map((it) => {
            //
            let code = codes.find((r) => r.nodeID === it._id);

            //
            return (
              <RunnerNode
                useCore={useCore}
                node={it}
                code={code}
                key={it._id}
              ></RunnerNode>
            );
          })}

          {/*  */}
        </>
      )}
    </>
  );
}

function RunnerNode({ useCore, code, node }) {
  let [display, renderReact] = useState(null);
  useEffect(() => {
    let cleans = [];

    compileNode({ bootCode: code.code })
      .then((output) => {
        window
          .remoteImport(output.url)
          .then((value) => {
            URL.revokeObjectURL(output.url);

            //
            //
            //

            if (value.setup) {
              //
              //
              //
              //
              //

              value.setup({
                useCore,
                onClean: (fnc) => {
                  cleans.push(fnc);
                },
                renderReact: (fnc) => {
                  renderReact(fnc());
                },
                onChangeRender: (fnc) => {
                  cleans.push(
                    useCore.subscribe((st, b4) => {
                      renderReact(fnc({ now: st, before: b4 }));
                    })
                  );
                },
              });

              //////////////
            }

            ////////////
          })
          .catch((r) => {
            console.error(r);
          });
      })
      .catch((r) => {
        console.error(r);
      });

    return () => {
      cleans.forEach((r) => r());
    };
    // console.log(code, node);
  }, [code, node, useCore]);

  //
  return <>{display}</>;
}
