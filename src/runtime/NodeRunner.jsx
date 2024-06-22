import * as React from "react";
import { transform } from "sucrase";

export function NodeRunner({ node, code }) {
  //
  let [core, setCore] = React.useState(false);

  React.useEffect(() => {
    //
    console.log(node, code);

    //
  }, [node, code]);

  return null;
}
