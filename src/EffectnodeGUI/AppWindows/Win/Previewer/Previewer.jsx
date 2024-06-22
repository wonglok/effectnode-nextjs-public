import { AppRunner } from "@/src/EffectnodeGUI/AppRunner/AppRunner";

export function Previewer({ useStore }) {
  let spaceID = useStore((r) => r.spaceID);
  return <>{spaceID && <AppRunner spaceID={spaceID}></AppRunner>}</>;
}

//

//
