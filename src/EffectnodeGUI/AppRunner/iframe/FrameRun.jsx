import { useEffect, useRef, useState } from "react";
import * as React from "react";
import { compileNode } from "./compileNode";
import { create } from "zustand";
export default function FrameRun() {
  let useCore = React.useMemo(() => {
    return create(() => {
      return {
        sendParent: () => {},
        graph: false,
        codes: [],
      };
    });
  }, []);

  let graph = useCore((r) => r.graph);
  let codes = useCore((r) => r.codes);

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

    useCore.setState({
      sendParent: send,
    });

    let hh = (ev) => {
      if (ev.data.launcher === launcher && ev.origin === location.origin) {
        let payload = ev.data.payload;
        let action = ev.data.action;

        if (action === "responseLaunchApp") {
          useCore.setState({
            graph: payload.graph,
            codes: payload.codes,
          });
        }
        if (action === "pushLatestState") {
          useCore.setState({
            graph: payload.graph,
            codes: payload.codes,
          });
        }
      }
    };
    window.addEventListener("message", hh);

    if (!readyRef.current) {
      readyRef.current = true;
      send({ action: "requestLaunchApp", payload: {} });
    }

    return () => {
      window.removeEventListener("message", hh);
    };
  }, [useCore]);

  let modules = React.useMemo(() => {
    return new Map();
  }, []);

  let works = React.useMemo(() => {
    return new Map();
  }, []);

  useEffect(() => {
    //
    let rAFID = 0;

    //
    let rAF = () => {
      rAFID = requestAnimationFrame(rAF);
      //
      for (let val of works.values()) {
        //
        for (let fnc of val) {
          //
          if (typeof fnc === "function") {
            fnc();
          }
        }
      }
      //
    };

    rAFID = requestAnimationFrame(rAF);
    return () => {
      cancelAnimationFrame(rAFID);
    };
  }, [works]);

  return (
    <>
      {graph && useCore && (
        <>
          {graph.nodes.map((it, idx, nodes) => {
            let code = codes.find((r) => r.nodeID === it._id);
            return (
              <RunnerNode
                edges={graph.edges}
                codes={codes}
                nodes={nodes}
                modules={modules}
                works={works}
                useCore={useCore}
                node={it}
                code={code}
                key={it._id}
              ></RunnerNode>
            );
          })}
        </>
      )}
    </>
  );
}

function RunnerNode({ nodes, modules, works, useCore, code, node }) {
  //
  let [display, mountReact] = useState(null);

  useEffect(() => {
    let localWork = [];
    works.set(node._id, localWork);
    let cleans = [];

    compileNode({ bootCode: code.code })
      .then((output) => {
        window
          .remoteImport(output.url)
          .then((value) => {
            modules.set(node.title, value);
            URL.revokeObjectURL(output.url);

            let run = () => {
              //
              //
              if (value.setup) {
                value.setup({
                  //
                  io: new Proxy(
                    {
                      //
                      //
                    },
                    {
                      get: (obj, key) => {
                        if (key.startsWith("out")) {
                          let idx = Number(key.replace("out", ""));

                          let output = node.outputs[idx];

                          return (val) => {
                            let edges = useCore?.getState()?.graph?.edges || [];

                            let destEdges = edges.filter(
                              (r) => r.output._id === output._id
                            );

                            destEdges.forEach((edge) => {
                              window.dispatchEvent(
                                new CustomEvent(edge.input._id, { detail: val })
                              );
                            });
                            //
                            //
                          };
                        }

                        if (key.startsWith("in")) {
                          let idx = Number(key.replace("in", ""));
                          let input = node.inputs[idx];

                          return (handler) => {
                            //
                            let hh = ({ detail }) => {
                              handler(detail);
                            };
                            window.addEventListener(input._id, hh);
                            cleans.push(() => {
                              window.removeEventListener(input._id, hh);
                            });
                            //
                          };
                        }
                      },
                      //
                      //
                    }
                  ),

                  //
                  getNode: (v) => modules.get(v),

                  ui: new Proxy(
                    {},
                    {
                      get: (obj, key) => {
                        let codes = useCore.getState().codes;
                        let code = codes.find((r) => r.nodeID === node._id);
                        let item = code.data.find((r) => r.label === key);

                        if (item) {
                          return item.value;
                        }
                      },
                    }
                  ),

                  useCore,

                  onLoop: (fnc) => {
                    localWork.push(fnc);
                  },
                  onClean: (fnc) => {
                    cleans.push(fnc);
                  },
                  mountReact: (item) => {
                    mountReact(item);
                  },
                  onChangeState: (fnc, noInit = false) => {
                    cleans.push(useCore.subscribe(fnc));

                    if (noInit) {
                      return;
                    }
                    setTimeout(() => {
                      useCore.setState({
                        ...useCore.getState(),
                      });
                    }, 100);
                  },
                });
              }
            };

            let tt = setInterval(() => {
              let hasItem = modules.size === nodes.length;
              if (hasItem) {
                clearInterval(tt);
                run();
              }
            }, 0);

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
      works.delete(node._id);
      works.set(node._id, []);
      cleans.forEach((r) => r());
    };
  }, [useCore]);

  //

  return (
    <>
      {/*  */}
      {display}
      {/*  */}
    </>
  );
}
