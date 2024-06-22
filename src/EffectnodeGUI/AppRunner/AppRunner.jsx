import { useEffect, useMemo, useRef } from "react";

export function AppRunner({ spaceID }) {
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

  useEffect(() => {
    if (!spaceID) {
      return;
    }

    if (el.src !== `/iframe/${spaceID}`) {
      el.src = `/iframe/${spaceID}`;
    }

    return () => {
      //
    };
  }, [spaceID, el]);
  return (
    <>
      <div ref={ref} className="w-full h-full"></div>
    </>
  );
}

//
