import { useSession, signIn, signOut } from "next-auth/react";

export default function AdminPage() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <div className="w-full h-full">
          Signed in as {session.user.name} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </div>
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
