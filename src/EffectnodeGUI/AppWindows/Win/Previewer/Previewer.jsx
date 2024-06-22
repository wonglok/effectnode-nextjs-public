import { AppRunner } from "@/src/EffectnodeGUI/AppRunner/AppRunner";

export function Previewer({ useStore }) {
  let spaceID = useStore((r) => r.spaceID);
  return (
    <>
      {spaceID && <AppRunner useStore={useStore} spaceID={spaceID}></AppRunner>}
    </>
  );
}

//

//
