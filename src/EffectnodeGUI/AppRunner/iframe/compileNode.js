import * as React from "react";
import * as ReactDOM from "react-dom/client";
import path from "path";
import { transform } from "sucrase";
// import * as Vue from "vue";

export const compileNode = async ({ bootCode = "" }) => {
  return new Promise(async (resolve) => {
    const rollupProm = import("rollup").then((r) => r.rollup); //2.56.3
    rollupProm.then(async (rollup) => {
      try {
        //
        //
        window.GlobalImport = window.GlobalImport || {};
        window.GlobalImport["react"] = React;
        window.GlobalImport["react-dom"] = ReactDOM;

        let runtimePatcher = (Variable, idName) => {
          let str = ` `;
          Object.entries(Variable).forEach(([key, val]) => {
            if (key === "default") {
              return;
            }

            str += `
    export const ${key} = window.GlobalImport["${idName}"]["${key}"];
`;
          });

          if (Variable.default) {
            str += `
    export default window.GlobalImport["${idName}"]["default"]
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

                if (id in window.GlobalImport) {
                  return `
                      ${runtimePatcher(window.GlobalImport[id], id)}
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
