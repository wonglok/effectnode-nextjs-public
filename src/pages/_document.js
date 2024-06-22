import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <script
        dangerouslySetInnerHTML={{
          __html: `
        window.remoteImport = (v) => {
          return import(v);
        };
        `,
        }}
      ></script>
      <script
        type="importmap"
        dangerouslySetInnerHTML={{
          __html: `
        {
				"imports": {
					"three": "../build/three.module.js",
					"three/addons/": "./jsm/",
					"three/nodes": "./jsm/nodes/Nodes.js"
				}
			}
        `,
        }}
      ></script>
      <body className="effectnode-app-container">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
