import { useEffect, useRef, useState } from "react";
import { transform } from "sucrase";
export default function HTML() {
  let [graph, setGraph] = useState(false);
  let [codes, setCodes] = useState([]);
  //
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
      //
      if (ev.data.launcher === launcher && ev.origin === location.origin) {
        //
        //
        let payload = ev.data.payload;
        let action = ev.data.action;

        console.log("[action]", action, "[payload]", payload);

        if (action === "reset") {
          setGraph(payload.graph);
          setCodes(payload.codes);
          //
          // console.log(action, payload);
          //
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

  console.log(graph, codes);

  return (
    <>
      <div>123</div>
    </>
  );
}

//
//
