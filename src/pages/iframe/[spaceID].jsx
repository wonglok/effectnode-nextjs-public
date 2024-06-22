import { useEffect, useRef, useState } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

export default function HTML() {
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

    const rollupProm = import("rollup").then((r) => r.rollup); //2.56.3
    rollupProm.then(async (rollup) => {
      //
      const localCode = `rollup://`;
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

      // runtimePatcher(React, "react");
      //

      let bundle = rollup({
        input: `./src/main.js`,
        plugins: [
          {
            name: "FS",
            async resolveId(source, importer) {
              if (source.includes(localCode)) {
                source = source.replace(`${localCode}`, "");
              }

              console.log(source);

              // console.log('importee', importee.replace(`${localCode}`, ''))
              // console.log('importer', importer)
              // return `${cleaned}`

              return source;
            },
            // async moduleParsed(info) {
            //     console.log(info)
            // },
            //
            async load(id) {
              console.log(id);
              if (id in window.GoGlobal) {
                return `
                  ${runtimePatcher(window.GoGlobal[id], id)}
                `;
              }

              let map = {
                ["three"]: "/jsrepo/three/build/three.module.js",
                ["three/addons/"]: "/jsrepo/three/examples/jsm/",
                ["three/nodes"]: "/jsrepo/three/examples/jsm/nodes/Nodes.js",
              };

              if (map[id]) {
                return await fetch(map[id]).then((r) => {
                  return r.text();
                });
              }

              if (id.includes("three/examples")) {
                return fetch(`/jsrepo/${id}`).then((r) => {
                  return r.text();
                });
              }

              if (id === "./src/main.js") {
                return `
                  import * as THREE from 'three';

                  console.log(THREE);

                  // import * as React from 'react'
                  // import * as ReactDOM from 'react-dom'
                  // console.log(React, ReactDOM);
                `;
              }

              //
              // if (id.indexOf(`/home/web/`) === 0) {
              //   let data = memfs.fs.readFileSync(id, "utf-8");
              //   return data;
              // } else {
              //   try {
              //     let fileText = memfs.fs.readFileSync(
              //       `/home/web/app/node_modules/${id}/package.json`,
              //       "utf-8"
              //     );

              //     let json = JSON.parse(fileText);
              //     let mainURL = json.main;
              //     let mainFile = memfs.fs.readFileSync(
              //       `/home/web/app/node_modules/${id}/${mainURL}`,
              //       "utf-8"
              //     );

              //     let content = mainFile;

              //     let tf = transform(content, {
              //       transforms: ["jsx"],
              //       preserveDynamicImport: true,
              //       production: true,
              //       jsxPragma: "React.createElement",
              //       jsxFragmentPragma: "React.Fragment",
              //     }).code;

              //     //
              //     console.log(tf);
              //     return tf;
              //   } catch (e) {
              //     console.log(e);
              //   }
              // }

              return `
                  console.log('not found');
              `;
              //rollup://core/
              ///home/web/app/node_modules/rollup://core/home/web/app/main.js/package.json
              // let data = memfs.readFileSync(`/home/web/app/node_modules/${id}/package.json`, 'utf-8')
            },
          },
        ],
      });

      let bdn = await bundle;
      let parcel = await bdn.generate({
        output: { format: "esm", dir: "./dist" },
      });
      let rawOutputs = parcel.output;

      console.log("[rawOutputs]", rawOutputs);
      let outputs = rawOutputs;

      console.log("code!", outputs[0].code);

      let blob = new Blob([outputs[0].code], {
        type: "application/javascript",
      });

      let url = URL.createObjectURL(blob);

      window.remoteImport(url).then(() => {
        //
        //
        //
      });
      //
    });
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
