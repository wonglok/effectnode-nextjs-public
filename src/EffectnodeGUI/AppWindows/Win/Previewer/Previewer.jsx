import { AppRunner } from "@/src/EffectnodeGUI/AppRunner/AppRunner";

export function Previewer({ useStore }) {
  let spaceID = useStore((r) => r.spaceID);
  return (
    <>
      <AppRunner spaceID={spaceID}></AppRunner>
    </>
  );
}
