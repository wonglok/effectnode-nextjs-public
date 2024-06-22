import { DashLayout } from "@/src/layout/DashLayout";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { createWorkspace, listWorkspaces } from "../api/Workspace";
import moment from "moment";

let useWorkspaces = () => {
  let [workspaces, setData] = useState([]);

  useEffect(() => {
    listWorkspaces.client(({ data }) => {
      setData(data);
    });
  }, []);

  let realodWorkspaces = () => {
    listWorkspaces.client(({ data }) => {
      setData(data);
    });
  };

  return { workspaces, realodWorkspaces };
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const { workspaces, realodWorkspaces } = useWorkspaces();

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
        <DashLayout session={session} title="Workspace">
          <div
            style={{ minHeight: `calc(100vh - 120px)`, overflowY: "scroll" }}
            className="p-4 w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6  gap-4 w-full h-full">
              <PlusCard
                onReload={() => {
                  realodWorkspaces();
                }}
              ></PlusCard>

              {workspaces.map((work) => {
                return <OneCard key={work._id} data={work}></OneCard>;
              })}
            </div>
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

function PlusCard({ onReload }) {
  return (
    <>
      <article className="inline-block cursor-default relative h-[400px] overflow-hidden rounded-lg shadow transition hover:shadow-lg">
        <img
          alt=""
          src="/img/computer.jpg"
          className="w-full h-full object-cover"
        ></img>

        <div className=" absolute top-0  left-0 w-full h-full bg-gradient-to-t from-gray-900/60 to-gray-900/25"></div>

        <div className="absolute bottom-0 left-0 w-full ">
          <div className="p-4 sm:p-6">
            <span className="block text-xs text-white/90">
              {`Let's create new`}
            </span>

            <h3 className="mt-0.5 text-lg text-white">{`Workspace`}</h3>

            <div className="text-right w-full">
              <button
                onClick={() => {
                  //
                  createWorkspace
                    .client({
                      title: "Happy Space",
                    })
                    .then(onReload);
                }}
                className="text-white/95 text-sm p-4 py-1 border border-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
              >
                Create
              </button>
            </div>

            {/*
            <p className="mt-2 line-clamp-3 text-sm/relaxed text-white/95 mb-3">
              <textarea className=" bg-transparent w-full border border-white p-2 rounded-lg">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Recusandae dolores, possimus pariatur animi temporibus nesciunt
                praesentium dolore sed nulla ipsum eveniet corporis quidem,
                mollitia itaque minus soluta, voluptates neque explicabo tempora
                nisi culpa eius atque dignissimos. Molestias explicabo corporis
                voluptatem?
              </textarea>
            </p>
            */}
          </div>
        </div>
      </article>
    </>
  );
}

function OneCard({ data }) {
  // console.log(data);

  return (
    <>
      <article className="inline-block cursor-default relative h-[400px] overflow-hidden rounded-lg shadow transition hover:shadow-lg">
        <img
          alt=""
          src="/img/sakura.jpg"
          className="w-full h-full object-cover"
        ></img>

        <div className=" absolute top-0  left-0 w-full h-full bg-gradient-to-t from-gray-900/60 to-gray-900/25"></div>
        <div className="absolute bottom-0 left-0 w-full ">
          <div className="p-4 sm:p-6">
            <a href="#" className="mb-2 inline-block">
              <h3 className="mt-0.5 text-lg text-white">
                {data.title || `My Title`}
              </h3>
            </a>

            <span className="block text-xs text-white/90">
              {moment(new Date(data.createdAt)).format("MMM Do YYYY")}
            </span>

            {/*
            <p className="mt-2 line-clamp-3 text-sm/relaxed text-white/95 mb-3">
              <textarea className=" bg-transparent w-full border border-white p-2 rounded-lg">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Recusandae dolores, possimus pariatur animi temporibus nesciunt
                praesentium dolore sed nulla ipsum eveniet corporis quidem,
                mollitia itaque minus soluta, voluptates neque explicabo tempora
                nisi culpa eius atque dignissimos. Molestias explicabo corporis
                voluptatem?
              </textarea>
            </p>
            */}

            <div className="text-right w-full">
              <a target="_blank" href={`/admin/workspace/${data._id}`}>
                <button className="text-white/95 text-sm p-4 py-1 border border-white rounded-lg hover:bg-gray-800 transition-colors duration-300">
                  Enter
                </button>
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
