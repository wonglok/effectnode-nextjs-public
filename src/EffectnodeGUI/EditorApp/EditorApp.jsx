import { BeginBar } from "../BeginBar/BeginBar";
import { BeginMenu } from "../BeginBar/BeginMenu";
import { ThankYouList } from "../BeginBar/ThankYouList";
import { AppWindows } from "../AppWindows/AppWindows";
import Link from "next/link";
export function EditorApp({ useStore }) {
  return (
    <div className="w-full h-full ">
      <div
        className="w-full from-gray-100 to-gray-500  bg-gradient-to-r"
        style={{ height: `1.6rem` }}
      >
        <div className="w-full h-full flex items-center justify-between px-2 text-sm">
          <div>
            <Link href={`/admin/workspace`} className="underline">
              EffectNode FX
            </Link>
          </div>
          <div className=""></div>
          <div className="text-white">EffectNode FX</div>
        </div>
      </div>
      <div
        className="w-full bg-white"
        style={{
          height: `calc(100% - 1.6rem - 1.6rem * 0.0 - 2.75rem)`,
        }}
      >
        <div className="w-full h-full relative">
          <AppWindows useStore={useStore}></AppWindows>
          <BeginMenu useStore={useStore}></BeginMenu>
          <ThankYouList useStore={useStore}></ThankYouList>
        </div>
      </div>
      <div
        className="w-full from-gray-100 to-gray-500 bg-gradient-to-l "
        style={{ height: `2.75rem` }}
      >
        <BeginBar useStore={useStore}></BeginBar>
      </div>
    </div>
  );
}

//

// Edge Version Advantage

//
