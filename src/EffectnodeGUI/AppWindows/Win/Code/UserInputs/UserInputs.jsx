import { useEffect, useRef, useState } from "react";
import { Pane } from "tweakpane";

export function UserInputs({ useStore, code, codes, graph }) {
  let data = code.data || [];
  // console.log(data);

  return (
    <>
      {/*  */}
      <div className="h-2"></div>
      {data.map((dat) => {
        return (
          <div key={dat._id}>
            {/*  */}
            {dat.type === "range" && (
              <>
                <Gear
                  codes={codes}
                  editor={
                    <RangeGear
                      code={code}
                      codes={codes}
                      useStore={useStore}
                      dat={dat}
                    ></RangeGear>
                  }
                  useStore={useStore}
                  dat={dat}
                >
                  <RangedInput
                    codes={codes}
                    useStore={useStore}
                    dat={dat}
                  ></RangedInput>
                </Gear>
              </>
            )}

            {dat.type === "text" && (
              <>
                <Gear
                  gear={
                    <TextGear
                      code={code}
                      codes={codes}
                      useStore={useStore}
                      dat={dat}
                    ></TextGear>
                  }
                  codes={codes}
                  useStore={useStore}
                  dat={dat}
                >
                  <TextInput
                    codes={codes}
                    useStore={useStore}
                    dat={dat}
                  ></TextInput>
                </Gear>
              </>
            )}

            {dat.type === "color" && (
              <>
                <Gear
                  gear={
                    <ColorGear
                      code={code}
                      codes={codes}
                      useStore={useStore}
                      dat={dat}
                    ></ColorGear>
                  }
                  codes={codes}
                  useStore={useStore}
                  dat={dat}
                >
                  <ColorInput
                    codes={codes}
                    useStore={useStore}
                    dat={dat}
                  ></ColorInput>
                </Gear>
              </>
            )}

            {/*  */}
            {/*  */}
          </div>
        );
      })}

      {/*  */}
    </>
  );
}

function ColorGear({ useStore, code, codes, dat }) {
  let refValue = useRef();

  useEffect(() => {
    const pane = new Pane({ container: refValue.current });

    pane.addBinding(dat, "label", {}).on("change", (v) => {
      dat.label = v.value;

      useStore.setState({
        codes: [...codes],
      });
    });

    const btn = pane.addButton({
      title: "remove this",
      label: `${dat.label}`, // optional
    });

    btn.on("click", () => {
      //
      let res = window.confirm("remove " + dat.label + " ?");
      if (res) {
        code.data = code.data.filter((r) => r._id !== dat._id);

        useStore.setState({
          codes: [...codes],
        });
      }
      //
    });

    return () => {
      pane.dispose();
    };
  }, [dat]);

  return (
    <>
      <div ref={refValue}></div>
    </>
  );
}

function TextGear({ useStore, code, codes, dat }) {
  let refValue = useRef();

  useEffect(() => {
    const pane = new Pane({ container: refValue.current });

    pane.addBinding(dat, "label", {}).on("change", (v) => {
      dat.label = v.value;

      useStore.setState({
        codes: [...codes],
      });
    });

    const btn = pane.addButton({
      title: "remove this",
      label: `${dat.label}`, // optional
    });

    btn.on("click", () => {
      //
      let res = window.confirm("remove " + dat.label + " ?");
      if (res) {
        code.data = code.data.filter((r) => r._id !== dat._id);

        useStore.setState({
          codes: [...codes],
        });
      }
      //
    });

    return () => {
      pane.dispose();
    };
  }, [dat]);

  return (
    <>
      <div ref={refValue}></div>
    </>
  );
}

function RangeGear({ useStore, code, codes, dat }) {
  let refValue = useRef();

  useEffect(() => {
    const pane = new Pane({ container: refValue.current });

    pane.addBinding(dat, "label", {}).on("change", (v) => {
      dat.label = v.value;

      useStore.setState({
        codes: [...codes],
      });
    });

    pane
      .addBinding(dat, "min", {
        step: 0.01,
      })
      .on("change", (v) => {
        dat.value = v.value;

        useStore.setState({
          codes: [...codes],
        });
      });

    pane
      .addBinding(dat, "max", {
        step: 0.01,
      })
      .on("change", (v) => {
        dat.value = v.value;

        useStore.setState({
          codes: [...codes],
        });
      });

    pane
      .addBinding(dat, "step", {
        step: 0.01,
      })
      .on("change", (v) => {
        dat.value = v.value;

        useStore.setState({
          codes: [...codes],
        });
      });

    const btn = pane.addButton({
      title: "remove this",
      label: `${dat.label}`, // optional
    });

    btn.on("click", () => {
      //
      let res = window.confirm("remove " + dat.label + " ?");
      if (res) {
        code.data = code.data.filter((r) => r._id !== dat._id);

        useStore.setState({
          codes: [...codes],
        });
      }
      //
    });

    return () => {
      pane.dispose();
    };
  }, [dat]);

  return (
    <>
      <div ref={refValue}></div>
    </>
  );
}

function Gear({ useStore, codes, dat, children, gear = null }) {
  let [show, setShow] = useState(false);

  if (!gear) {
    return (
      <div className="mx-2 mb-2 flex items-start">
        <div style={{ width: `calc(100% - 0px)` }} className="h-full">
          {children}
        </div>
      </div>
    );
  }
  return (
    <>
      {show === false && (
        <div className="mx-2 mb-2 flex items-start">
          <div style={{ width: `calc(100% - 28px)` }} className="h-full">
            {children}
          </div>

          <div
            onClick={() => {
              setShow(!show);
            }}
            className="h-28px] w-[28px] text-xs flex items-start justify-center ml-1"
          >
            <img className="w-full cursor-pointer" src={`/img/gears.png`}></img>
          </div>
        </div>
      )}

      {show === true && (
        <div className="mx-2 mb-2 flex items-start">
          <div style={{ width: `calc(100% - 28px)` }} className="h-full">
            {gear}
          </div>

          <div
            onClick={() => {
              setShow(!show);
            }}
            className="h-28px] w-[28px] text-xs flex items-start justify-center ml-1"
          >
            <img className="w-full cursor-pointer" src={`/img/gears.png`}></img>
          </div>
        </div>
      )}
    </>
  );
}

function RangedInput({ useStore, codes, dat }) {
  let refValue = useRef();

  useEffect(() => {
    const PARAMS = {};
    PARAMS[dat.label] = isNaN(dat.value) ? 0 : dat.value || 0;

    const pane = new Pane({ container: refValue.current });

    pane
      .addBinding(PARAMS, dat.label, {
        step: dat.step || 0.01,
      })
      .on("change", (v) => {
        dat.value = v.value;

        useStore.setState({
          codes: [...codes],
        });
      });

    return () => {
      pane.dispose();
    };
  }, [dat]);

  return (
    <>
      <div ref={refValue}></div>
    </>
  );
}

function TextInput({ useStore, codes, dat }) {
  let refValue = useRef();

  useEffect(() => {
    const PARAMS = {};
    PARAMS[dat.label] = dat.value || " ";

    const pane = new Pane({ container: refValue.current });

    pane.addBinding(PARAMS, dat.label, {}).on("change", (v) => {
      dat.value = v.value;

      useStore.setState({
        codes: [...codes],
      });
    });

    return () => {
      pane.dispose();
    };
  }, [dat]);

  return (
    <>
      <div ref={refValue}></div>
    </>
  );
}

//

function ColorInput({ useStore, codes, dat }) {
  let refValue = useRef();

  useEffect(() => {
    const PARAMS = {};
    PARAMS[dat.label] = dat.value || "#ffffff";

    const pane = new Pane({ container: refValue.current });

    pane.addBinding(PARAMS, dat.label, {}).on("change", (v) => {
      dat.value = v.value;
      useStore.setState({
        codes: [...codes],
      });
    });

    return () => {
      pane.dispose();
    };
  }, [dat]);

  return (
    <>
      <div ref={refValue}></div>
    </>
  );
}

//
