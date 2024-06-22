import { useEffect, useMemo, useRef } from "react";
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

  useEffect(() => {
    if (!spaceID) {
      return;
    }

    if (
      el.src !== `/iframe/${spaceID}?launcher=${encodeURIComponent(launcher)}`
    ) {
      el.src = `/iframe/${spaceID}?launcher=${encodeURIComponent(launcher)}`;

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
            //
            let tt = 0;
            let cleaner = useStore.subscribe(() => {
              clearTimeout(tt);
              tt = setTimeout(() => {
                send({
                  action: "reboot",
                  payload: useStore.getState().editorAPI.exportBackup(),
                });
              }, 100);
            });

            //

            cleans.push(cleaner);

            //
          }
        }
      };
      window.addEventListener("message", hh);
      return () => {
        cleans.forEach((r) => {
          r();
        });
        window.removeEventListener("message", hh);
      };
    }

    return () => {
      //
    };
  }, [launcher, spaceID, el, useStore]);
  return (
    <>
      <div ref={ref} className="w-full h-full"></div>
    </>
  );
}

//
