import { EditorRoot } from "@/src/EffectnodeGUI/EditorRoot";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Page() {
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
        <EditorRoot></EditorRoot>
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
