import { useEffect, useRef, useState } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import path, { join } from "path";
import { transform } from "sucrase";
import { getCompile } from "./getCompile";
import { compileNode } from "./compileNode";
import { ref, watchEffect } from "vue";

export default function FrameRun() {
  let [state, setState] = useState({});

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

  let [core, setCore] = useState();

  useEffect(() => {
    let { graph, codes } = state;

    if (!codes || !graph) {
      return;
    }

    //

    //
    //
    //
    //
  }, [state]);
  return (
    <>
      {/* {
        graph &&
        graph.nodes.map((n) => {
          let code = codes.find((r) => r.nodeID === n._id);
          return <NodeRunner code={code} node={n} key={n._id}></NodeRunner>;
        })} */}

      {/*  */}

      {graph && (
        <>
          {/*  */}

          {graph.nodes.map((it) => {
            //
            let code = codes.find((r) => r.nodeID === it._id);

            //
            return <RunnerNode node={it} code={code} key={it._id}></RunnerNode>;
          })}

          {/*  */}
        </>
      )}
    </>
  );
}

function RunnerNode({ code, node }) {
  let [api, setAPI] = useState({});
  useEffect(() => {
    compileNode({ bootCode: code.code })
      .then((output) => {
        window.remoteImport(output.url).then((value) => {
          URL.revokeObjectURL(output.url);

          // console.log("[module]", value);

          if (value.setup) {
            value.setup({
              happy: 123,
            });
          }

          //
          // console.log(Object.keys(value));
          //

          //
          // setAPI({
          //   display: null,
          // });
          //
        });
      })
      .catch((r) => {
        console.error(r);
      });
    // console.log(code, node);
  }, [code, node]);

  //
  return <>{api.display}</>;
}
