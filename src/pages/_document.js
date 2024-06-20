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
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
