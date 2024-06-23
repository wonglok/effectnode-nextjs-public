import { copyJSON } from "public";
import { useEffect, useRef, useState } from "react";
import { Pane } from "tweakpane";

export function UserInputs({ useStore, code, codes, graph }) {
  let data = code.data || [];
  console.log(data);
  return (
    <>
      {/*  */}

      {data.map((dat) => {
        return (
          <div key={dat._id}>
            {/*  */}
            {dat.type === "range" && (
              <>
                <RangedInput dat={dat}></RangedInput>
              </>
            )}
            {/*  */}
          </div>
        );
      })}

      {/*  */}
    </>
  );
}

function RangedInput({ dat }) {
  let refValue = useRef();

  let [_, reload] = useState(0);
  useEffect(() => {
    //
    const PARAMS = {
      [dat.label]: dat.value,
    };

    const pane = new Pane({ container: refValue.current });

    pane
      .addBinding(PARAMS, dat.label, {
        step: dat.step,
      })
      .on("change", () => {
        // dat.value = PARAMS[dat.label];
        reload((s) => s + 1);
      });

    pane.addBinding(dat, "step", {}).on("change", () => {
      // dat.value = PARAMS[dat.label];
      reload((s) => s + 1);
    });

    return () => {
      pane.dispose();
    };
  }, [dat, _]);

  return (
    <>
      <div ref={refValue}></div>
    </>
  );
}

//
