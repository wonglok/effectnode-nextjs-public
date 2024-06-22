import { useEffect, useMemo, useRef, useState } from "react";
import { getID } from "../utils/getID";

export function AppRunner({ useStore, spaceID }) {
  let ref = useRef();
  let el = useMemo(() => {
    let el = document.createElement("iframe");
    el.classList.add("w-full");
    el.classList.add("h-full");
    return el;
  }, []);

  useEffect(() => {
    ref.current.innerHTML = "";
    ref.current.appendChild(el);
    return () => {
      el.remove();
    };
  }, [el]);

  let launcher = useMemo(() => {
    return getID();
  }, []);

  let [ready, setReady] = useState(false);

  useEffect(() => {
    if (!spaceID) {
      return;
    }

    if (el.src !== `/iframe/ExRun?launcher=${encodeURIComponent(launcher)}`) {
      el.src = `/iframe/ExRun?launcher=${encodeURIComponent(launcher)}`;

      //

      let send = ({ action = "action", payload = {} }) => {
        return el?.contentWindow?.postMessage(
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
      //
      //
      let cleans = [];
      let hh = (ev) => {
        //
        if (ev.data.launcher === launcher && ev.origin === location.origin) {
          //
          //
          let payload = ev.data.payload;
          let action = ev.data.action;

          // console.log("[payload]", payload);
          // console.log("[action]", action);

          if (action === "ready") {
            let backup = useStore.getState().editorAPI.exportBackup();
            send({
              action: "reboot",
              payload: backup,
            });
            setReady(true);
            //
          }
        }
      };
      window.addEventListener("message", hh);

      let hh2 = () => {
        el.contentWindow.location.reload();
      };
      window.addEventListener("editor-save", hh2);

      return () => {
        cleans.forEach((r) => {
          r();
        });
        window.removeEventListener("editor-save", hh);
        window.removeEventListener("message", hh);
      };
    }

    return () => {
      //
    };
  }, []);

  return (
    <>
      <div
        style={{ height: `30px` }}
        className="bg-gray-200 border-b border-gray-400 px-2 flex items-center"
      >
        <button
          className=" text-xs mr-2 underline"
          onClick={() => {
            let href = el.contentWindow.location.href;
            el.contentWindow.location.assign(href);
          }}
        >
          ♻️ Reload
        </button>
      </div>
      <div style={{ height: `calc(100% - 30px)` }}>
        <div ref={ref} className="w-full h-full"></div>
      </div>
    </>
  );
}

//
