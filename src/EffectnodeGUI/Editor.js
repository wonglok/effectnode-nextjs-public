/** @license
 * MIT License
 * @description
 * Copyright 2024 WONG LOK

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { create } from "zustand";
import { EditorApp } from "./EditorApp/EditorApp";
import { useEffect, useRef, useState } from "react";
import { getID } from "./utils/getID";
import { myApps, myWins } from "./utils/myApps";
import { useRouter } from "next/router";
import { getOneWorkspace } from "@/pages/api/workspace";

export const Editor = () => {
  let [val, setVal] = useState(
    <div className="w-full h-full flex items-center justify-center">
      <div className=" text-center">Loading...</div>
    </div>
  );

  let router = useRouter();
  let query = router.query || {};
  let spaceID = query.spaceID || false;

  useEffect(() => {
    if (!spaceID) {
      return;
    }
    if (!router) {
      return;
    }

    let core = new EditorCore();

    Promise.all(
      //
      [getOneWorkspace.client({ _id: spaceID }), []]
    )
      //
      //
      .then((array) => {
        let [workspaceResp, items] = array;
        let workspace = workspaceResp?.data;
        //
        //
        core.onChange((state, before) => {
          //
          console.log(state);

          //
          localStorage.setItem(
            spaceID,
            JSON.stringify({
              apps: state.apps,
              wins: state.wins,
            })
          );
        });

        try {
          let state = JSON.parse(localStorage.getItem(spaceID));
          if (state && state.apps && state.wins) {
            // core.setState({
            //   apps: state.apps,
            //   wins: state.wins,
            // });
          }
        } catch (e) {
          console.log(e);
        }

        core.bootup();

        if (workspace) {
          core.setState({
            workspace: workspace,
            items: items || [],
          });
          setVal(core.getReactElement());
        } else {
          router.push(`/admin/workspace`);
        }
      });
  }, [router, spaceID]);

  return <>{val}</>;
};

export class EditorCore {
  constructor() {
    let self = this;

    this.cleans = [];
    this.works = [];
    this.isEditor = true;
    this.domElement = document.createElement("div");
    this.domElement.classList.add("effectnode-app-container");

    this.store = create((set, get) => {
      return {
        apps: [],
        wins: [],
        workspace: false,
        items: [],

        //
        overlayPop: "",
        set,
        get,

        mouseState: {
          winID: "",
          func: "moveWin",
          isDown: false,
          start: [0, 0],
          now: [0, 0],
          last: [0, 0],
          delta: [0, 0],
          accu: [0, 0],
        },
      };
    });

    this.store.saveKeys = [
      //
      "apps",
      "wins",
      "workspace",
      "items",
    ];

    this.setState = (v = {}) => {
      this.store.setState(v);
    };
    this.getState = () => {
      return this.store.getState();
    };
    this.onChange = (fnc) => {
      let clean = self.store.subscribe(fnc);
      this.cleans.push(clean);
    };
    this.onLoop = (fnc) => {
      this.works.push(fnc);
    };

    this.onClean = (fnc) => {
      this.cleans.push(fnc);
    };

    this.dispose = () => {
      this.works = [];
      this.cleans.forEach((clean) => {
        clean();
      });
      if (this.domElement.parentNode) {
        this.domElement.parentNode.removeChild(this.domElement);
      }
    };

    this.getReactElement = () => (
      <EditorApp useStore={this.store} parent={this}></EditorApp>
    );

    this.exportBackup = () => {
      let st = JSON.parse(JSON.stringify(this.getState()));
      let processedData = {};
      for (let kn of this.store.saveKeys) {
        if (st[kn]) {
          processedData[kn] = st[kn];
        }
      }
      return processedData;
    };
    this.restoreBackup = (state) => {
      let st = JSON.parse(JSON.stringify(state));
      let processedData = {};
      for (let kn of this.store.saveKeys) {
        if (st[kn]) {
          processedData[kn] = st[kn];
        }
      }
      this.setState(processedData);
    };

    this.bootup = () => {
      let { apps, wins } = this.getState();
      if (!apps.some((r) => r.type === "editor")) {
        let appID = getID();

        let app = JSON.parse(
          JSON.stringify(myApps.find((r) => r.type === "editor"))
        );
        app._id = appID;

        let win = JSON.parse(
          JSON.stringify(myWins.find((r) => r.type === "editor"))
        );
        win._id = getID();
        win.appID = appID;
        win.zIndex = wins.length;

        win.width = 500;
        win.height = 375;

        apps.push(app);
        wins.push(win);

        win.top = 10;
        win.left = 10;

        this.setState({
          apps: [...apps],
          wins: [...wins],
          overlayPop: "",
        });
      }

      if (!apps.some((r) => r.type === "previewer")) {
        let appID = getID();

        let app = JSON.parse(
          JSON.stringify(myApps.find((r) => r.type === "previewer"))
        );
        app._id = appID;

        let win = JSON.parse(
          JSON.stringify(myWins.find((r) => r.type === "previewer"))
        );
        win._id = getID();
        win.appID = appID;
        win.zIndex = wins.length;

        win.top = 10;
        win.left = window.innerWidth - win.width - 10;

        apps.push(app);
        wins.push(win);

        this.setState({
          apps: [...apps],
          wins: [...wins],
          overlayPop: "",
        });
      }
    };
  }
}

//
