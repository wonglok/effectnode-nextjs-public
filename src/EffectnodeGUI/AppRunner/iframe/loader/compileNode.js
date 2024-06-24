import * as React from "react";
import * as ReactDOM from "react-dom/client";
import path from "path";
import { transform } from "sucrase";
import * as R3F from "@react-three/fiber";
import * as Drei from "@react-three/drei";
import * as R3FPost from "@react-three/postprocessing";
import * as NativePost from "postprocessing";

export const compileNode = async ({
  spaceID,
  nodes,
  modules,
  bootCode = "",
}) => {
  return new Promise(async (resolve) => {
    const rollupProm = import("rollup").then((r) => r.rollup); //2.56.3
    rollupProm.then(async (rollup) => {
      //
      //
      //
      try {
        //
        //

        window[spaceID] = window[spaceID] || {};

        window[spaceID].GlobalImport = window[spaceID].GlobalImport || {};
        window[spaceID].GlobalImport["react"] = React;
        window[spaceID].GlobalImport["react-dom"] = ReactDOM;
        window[spaceID].GlobalImport["@react-three/fiber"] = R3F;
        window[spaceID].GlobalImport["@react-three/drei"] = Drei;
        window[spaceID].GlobalImport["@react-three/postprocessing"] = R3FPost;
        window[spaceID].GlobalImport["postprocessing"] = NativePost;

        window[spaceID].NodeModules = modules;

        let runtimePatcher = (Variable, idName) => {
          let str = ` `;
          Object.entries(Variable).forEach(([key, val]) => {
            if (key === "default") {
              return;
            }

            str += `
    export const ${key} = window["${spaceID}"].GlobalImport["${idName}"]["${key}"];
`;
          });

          if (Variable.default) {
            str += `
    export default window["${spaceID}"].GlobalImport["${idName}"]["default"]
`;
          }

          return str;
        };

        let modulePatcher = (Variable, idName) => {
          let str = ` `;
          Object.entries(Variable).forEach(([key, val]) => {
            if (key === "default") {
              return;
            }

            str += `
    export const ${key} = window["${spaceID}"].NodeModules.get("${idName}")["${key}"];
`;
          });

          if (Variable.default) {
            str += `
    export default window["${spaceID}"].NodeModules.get("${idName}")["default"]
`;
          }

          return str;
        };

        let bundle = rollup({
          input: `effectnode.bootloader.js`,
          plugins: [
            {
              name: "FS",
              async resolveId(source, importer) {
                if (!importer) {
                  // console.log(importee, 'importee')
                  return source;
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
                //

                if (importer) {
                  let arr = importer.split("/");
                  arr.pop();
                  let parent = arr.join("/");
                  let joined = path.join(parent, source);
                  return joined;
                }
              },
              async load(id) {
                if (id === "not-self") {
                  return `
                    throw new Error('cannot import modle itself');
                  `;
                }
                if (id === "effectnode.bootloader.js") {
                  let tCocde = transform(bootCode, {
                    transforms: ["jsx"],
                    preserveDynamicImport: true,
                    production: true,
                    jsxPragma: "React.createElement",
                    jsxFragmentPragma: "React.Fragment",
                  }).code;

                  return tCocde;
                }

                if (nodes.some((r) => r.title === id)) {
                  return new Promise((resolve) => {
                    let tt = setInterval(() => {
                      if (modules.has(id)) {
                        clearInterval(tt);

                        let str = ``;
                        str += `${modulePatcher(modules.get(id), id)}`;

                        resolve(str);
                      }
                    });
                    //
                    //
                  });
                }

                if (id in window[spaceID].GlobalImport) {
                  return `${runtimePatcher(window[spaceID].GlobalImport[id], id)}`;
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

        let bdn = await bundle;

        let parcel = await bdn.generate({
          output: { format: "esm", dir: "./dist" },
        });

        let rawOutputs = parcel.output;

        let outputs = rawOutputs;

        let blob = new Blob([outputs[0]?.code], {
          type: "application/javascript",
        });

        let url = URL.createObjectURL(blob);

        resolve({ url, outputs });
      } catch (er) {
        console.error(er);
      }
    });
  });
};
