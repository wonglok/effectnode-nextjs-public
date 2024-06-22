import { createRef, useEffect, useMemo, useRef, useState } from "react";

export function AppRunner({ spaceID }) {
  let ref = useRef();
  let el = useMemo(() => {
    let el = document.createElement("iframe");
    return el;
  }, []);

  useEffect(() => {
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

    //

    return () => {};
  }, [spaceID, el]);
  return (
    <>
      <div ref={ref} className="w-full h-full"></div>
    </>
  );
}

//
