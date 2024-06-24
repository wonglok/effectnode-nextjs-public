import { AppRunner } from "@/src/EffectnodeGUI/AppRunner/AppRunner";
import { useCallback, useEffect, useState } from "react";

export function Previewer({ useStore }) {
  let spaceID = useStore((r) => r.spaceID);
  let getState = useCallback(() => {
    return useStore.getState().editorAPI.exportBackup();
  }, [useStore]);

  return (
    <>
      {spaceID && (
        <AppRunner
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
