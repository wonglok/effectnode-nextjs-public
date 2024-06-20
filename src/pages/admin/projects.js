import { DashLayout } from "@/layout/DashLayout";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AdminPage() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <DashLayout session={session}>
          <div className="flex h-[90vh] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <span className="dark:text-white">Projects</span>
          </div>
        </DashLayout>
        {/* <div className="">
          Signed in as {session?.user?.name || "Developer Admin"} <br />
         
        </div> */}
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
