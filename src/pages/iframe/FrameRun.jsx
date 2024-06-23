import { useEffect, useRef, useState } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import path, { join } from "path";
import { transform } from "sucrase";
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

        if (action === "reboot") {
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

  useEffect(() => {
    let { graph, codes } = state;

    if (!codes) {
      return;
    }

    const rollupProm = import("rollup").then((r) => r.rollup); //2.56.3
    rollupProm.then(async (rollup) => {
      //
      const localCode = `effectnode://`;
      window.GoGlobal = window.GoGlobal || {};
      window.GoGlobal["react"] = React;
      window.GoGlobal["react-dom"] = ReactDOM;

      let runtimePatcher = (Variable, idName) => {
        let str = ` `;
        Object.entries(Variable).forEach(([key, val]) => {
          if (key === "default") {
            return;
          }
          str += `
export const ${key} = window.GoGlobal["${idName}"]["${key}"];
`;
        });

        if (Variable.default) {
          str += `
export default window.GoGlobal["${idName}"]["default"]
`;
        }

        return str;
      };

      //
      // runtimePatcher(React, "react");
      //

      let bundle = rollup({
        input: `effectnode.js`,
        plugins: [
          {
            name: "FS",
            async resolveId(source, importer) {
              if (!importer) {
                // console.log(importee, 'importee')
                return source;
              }

              if (source.startsWith("@/")) {
                return source.replace("@/", localCode);
              }

              if (source.startsWith("three")) {
                if (source === "three") {
                  return "/jsrepo/three/build/three.module.js";
                }
                if (source === "three/nodes") {
                  return "/jsrepo/three/examples/jsm/nodes/Nodes.js";
                }
                if (source.startsWith("three/addons/")) {
                  return (
                    "/jsrepo/three/examples/jsm/" +
                    source.replace("three/addons/", "")
                  );
                }
                return;
              }

              if (importer) {
                let arr = importer.split("/");
                arr.pop();
                let parent = arr.join("/");
                let joined = path.join(parent, source);
                return joined;
              }
            },
            async load(id) {
              if (id === "effectnode.js") {
                let str = ``;
                graph.nodes.forEach((nd) => {
                  str += `import "${nd.title}";`;
                });

                return `
                  ${str}
                `;
              }

              if (graph.nodes.some((r) => r.title === id)) {
                let node = graph.nodes.find(
                  (r) =>
                    r.title ===
                    id
                      .replace(localCode, "")
                      .replace(".js", "")
                      .replace(".jsx", "")
                );

                let content = codes.find((r) => r.nodeID === node._id)?.code;

                let tCocde = transform(content, {
                  transforms: ["jsx"],
                  preserveDynamicImport: true,
                  production: true,
                  jsxPragma: "React.createElement",
                  jsxFragmentPragma: "React.Fragment",
                }).code;

                return `
                  ${tCocde}
                `;
              }

              if (id in window.GoGlobal) {
                return `
                  ${runtimePatcher(window.GoGlobal[id], id)}
                `;
              }

              if (id.startsWith(`/`)) {
                return fetch(`${id}`)
                  .then((r) => {
                    return r.text();
                  })
                  .then((content) => {
                    let tCocde = transform(content, {
                      transforms: ["jsx"],
                      preserveDynamicImport: true,
                      production: true,
                      jsxPragma: "React.createElement",
                      jsxFragmentPragma: "React.Fragment",
                    }).code;

                    return tCocde;
                  });
              }

              return `
                  console.log('[not found]', ${id});
              `;
            },
          },
        ],
      });
      //

      try {
        let bdn = await bundle;
        let parcel = await bdn.generate({
          output: { format: "esm", dir: "./dist" },
        });
        let rawOutputs = parcel.output;

        // console.log("[rawOutputs]", rawOutputs);
        let outputs = rawOutputs;

        // console.log("code!", outputs[0].code);

        let blob = new Blob([outputs[0]?.code], {
          type: "application/javascript",
        });

        let url = URL.createObjectURL(blob);

        let yo = document.body.childNodes;
        for (let item of yo) {
          document.body.removeChild(item);
        }

        if (window.stopLoop) {
          window.stopLoop();
        }
        window.remoteImport(url).then((mod) => {
          //
          window.stopLoop = mod.stop;
        });
      } catch (er) {
        console.error(er);
      }
      //
    });

    return () => {
      let yo = document.body.childNodes;
      for (let item of yo) {
        document.body.removeChild(item);
      }
    };
  }, [state]);

  //

  return (
    <>
      {/* {
        graph &&
        graph.nodes.map((n) => {
          let code = codes.find((r) => r.nodeID === n._id);
          return <NodeRunner code={code} node={n} key={n._id}></NodeRunner>;
        })} */}
    </>
  );
}

//
//
