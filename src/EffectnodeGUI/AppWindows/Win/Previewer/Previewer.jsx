import { AppRunner } from "@/src/EffectnodeGUI/AppRunner/AppRunner";
import { useCallback, useEffect, useState } from "react";

export function Previewer({ useStore }) {
  let spaceID = useStore((r) => r.spaceID);
  let getState = useCallback(() => {
    return useStore.getState().editorAPI.exportBackup();
  }, [useStore]);

  let [state, setState] = useState(false);

  useEffect(() => {
    return useStore.subscribe((now, before) => {
      if (now.codes !== before.codes) {
        //
        setState(getState());
        //
      }
    });
  }, [useStore, getState]);
  return (
    <>
      {spaceID && (
        <AppRunner
          state={state}
          useStore={useStore}
          getState={getState}
          spaceID={spaceID}
        ></AppRunner>
      )}
    </>
  );
}

//

//
