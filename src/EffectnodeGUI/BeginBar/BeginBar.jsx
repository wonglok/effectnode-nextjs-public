import icon from "./img/effectnode-icon.svg";
import { myWins } from "../utils/myApps";
import { getID } from "../utils/getID";

export function BeginBar({ useStore }) {
  let apps = useStore((r) => r.apps);
  let wins = useStore((r) => r.wins);
  let overlayPop = useStore((r) => r.overlayPop);

  return (
    <>
      <div className="w-full h-full flex items-center justify-between text-sm">
        <div className=" w-44">
          {/*  */}

          {/*  */}
        </div>
        <div className="flex justify-start">
          <div
            onClick={() => {
              if (overlayPop === "menu") {
                useStore.setState({ overlayPop: "" });
              } else if (overlayPop) {
                useStore.setState({ overlayPop: "menu" });
              } else {
                useStore.setState({ overlayPop: "menu" });
              }
            }}
            className="bg-white rounded-full overflow-hidden h-9 m-1 px-4 flex items-center justify-center cursor-pointer"
          >
            <img
              className="fill-white h-full bg-white py-2 select-none"
              src={icon}
            ></img>
          </div>

          {apps.map((app) => {
            //
            // let app = apps.find((r) => r._id === win.appID)
            let win = wins.find((r) => r.appID === app._id);
            return (
              <div
                onClick={() => {
                  useStore.setState({
                    overlayPop: "",
                  });

                  if (win) {
                    let idx = wins.findIndex((w) => w._id === win._id);
                    wins.splice(idx, 1);
                    wins.push(win);

                    wins = wins.map((eachWin, idx) => {
                      eachWin.zIndex = idx;
                      return eachWin;
                    });
                  } else {
                    //
                    let appID = app._id;

                    let type = app.type;

                    let win = JSON.parse(
                      JSON.stringify(myWins.find((r) => r.type === type))
                    );
                    win._id = getID();
                    win.appID = appID;
                    win.zIndex = wins.length;

                    wins.push(win);
                  }

                  useStore.setState({
                    apps: [...apps],
                    wins: [...wins],
                  });
                }}
                key={app._id + "appIcon"}
                className="bg-white text-black rounded-full overflow-hidden h-9 m-1 px-4 flex items-center justify-center cursor-pointer"
              >
                {app.appIconText}
              </div>
            );
          })}
        </div>
        <div className="w-44">
          <div className="flex flex-col justify-end mr-2">
            <div className="text-right">Yo!</div>
            <div
              className="text-right underline cursor-pointer"
              onClick={() => {
                //
                if (overlayPop === "credits") {
                  useStore.setState({ overlayPop: "" });
                } else if (overlayPop) {
                  useStore.setState({ overlayPop: "credits" });
                } else {
                  useStore.setState({ overlayPop: "credits" });
                }

                //
              }}
            >
              About Credits
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
