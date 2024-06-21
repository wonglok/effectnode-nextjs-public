import { EditorCanvas } from "@/EffectnodeGUI/AppWindows/Win/Editor/EditorCanvas";

export function Editor() {
  return (
    <>
      <div className=" absolute top-0 left-0 w-full h-full">
        <div
          className="w-full bg-gray-200 border-b border-gray-400 text-sm flex items-center "
          style={{ height: `calc(25px)` }}
        >
          <span
            className=" underline cursor-pointer px-2"
            onClick={() => {
              //
            }}
          >
            Create Item
          </span>
        </div>
        <div className="w-full" style={{ height: `calc(100% - 25px)` }}>
          <EditorCanvas></EditorCanvas>
        </div>
      </div>
    </>
  );
}

//

//

//
