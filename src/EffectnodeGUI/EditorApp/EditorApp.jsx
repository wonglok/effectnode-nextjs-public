import { BeginBar } from "../BeginBar/BeginBar";
import { BeginMenu } from "../BeginBar/BeginMenu";
import { ThankYouList } from "../BeginBar/ThankYouList";
import { AppWindows } from "../AppWindows/AppWindows";
import Link from "next/link";
import { renameOneWorkspace } from "@/pages/api/workspace";
export function EditorApp({ useStore }) {
  let workspace = useStore((r) => r.workspace);
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
            <span className="mx-2">/</span>
            <span
              className="underline text-blue-500 cursor-pointer"
              onClick={() => {
                let newTitle = window.prompt(
                  "Rename Workspace title",
                  workspace.title
                );
                renameOneWorkspace
                  .client({
                    _id: workspace._id,
                    title: newTitle,
                  })
                  .then(() => {
                    useStore.setState({
                      workspace: {
                        ...workspace,
                        title: newTitle,
                      },
                    });
                  });
              }}
            >
              {workspace.title}
            </span>
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
