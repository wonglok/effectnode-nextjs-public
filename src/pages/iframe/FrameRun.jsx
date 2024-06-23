import { useEffect, useRef, useState } from "react";
import * as React from "react";
import { compileNode } from "./compileNode";
import { create } from "zustand";
export default function FrameRun() {
  let [state, setState] = useState({});

  let [sendParent, setSend] = useState(() => {
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

  let { graph, codes } = state;
  let useCore = React.useMemo(() => {
    if (!graph) {
      return false;
    }
    return create(() => {
      return {
        sendParent,
        graph,
        nodes: graph.nodes,
        edges: graph.edges,
        codes,
      };
    });
  }, [codes, graph, sendParent]);

  useEffect(() => {
    if (!useCore) {
      return;
    }

    return useCore.subscribe((now, before) => {
      console.log(now, before);
    });
  }, [useCore]);
  let works = React.useMemo(() => {
    return new Map();
  }, []);
  useEffect(() => {
    let rAFID = 0;
    let rAF = () => {
      rAFID = requestAnimationFrame(rAF);
      //
      for (let val of works.values()) {
        for (let fnc of val) {
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
          {graph.nodes.map((it) => {
            let code = codes.find((r) => r.nodeID === it._id);
            return (
              <RunnerNode
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

function RunnerNode({ works, useCore, code, node }) {
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
            URL.revokeObjectURL(output.url);

            if (value.setup) {
              value.setup({
                data: code.data,
                useCore,
                onLoop: (fnc) => {
                  localWork.push(fnc);
                },
                onClean: (fnc) => {
                  cleans.push(fnc);
                },
                renderOnce: (item) => {
                  mountReact(item);
                },
                onChangeCore: (fnc) => {
                  cleans.push(useCore.subscribe(fnc));
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
      works.delete(node._id);
      cleans.forEach((r) => r());
    };
  }, [code, node, useCore, works]);

  //
  return <>{display}</>;
}
