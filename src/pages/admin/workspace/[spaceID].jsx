import { Editor } from "@/EffectnodeGUI/Editor";
import { useSession, signIn, signOut } from "next-auth/react";

export default function EditorPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className=" text-center">Loading...</div>
      </div>
    );
  }

  if (session) {
    return (
      <>
        <Editor></Editor>
      </>
    );
  }

  return (
    <>
      <div className="w-full h-full flex items-center justify-center">
        <div className=" text-center">
          Not signed in <br />
          <button className="underline" onClick={() => signIn()}>
            Sign in
          </button>
        </div>
      </div>
    </>
  );
}
