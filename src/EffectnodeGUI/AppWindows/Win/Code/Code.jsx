export function Code({ win, useStore }) {
  let wins = useStore((r) => r.wins);
  let graph = useStore((r) => r.graph);
  let nodes = graph.nodes;
  let node = nodes.find((r) => r._id === win.nodeID);
  return (
    <>
      <div className="w-full h-full " style={{}}>
        <div
          className="w-full text-sm flex items-center  bg-gray-200  border-b border-gray-400"
          style={{ height: "30px" }}
        >
          <span
            className="mx-2 underline"
            onClick={() => {
              //
              //   console.log(newTitle);
              //

              let newTitle = prompt(
                `new title: ${node.title}`,
                `${node.title}`
              );

              node.title = newTitle;
              win.title = `🧑🏼‍💻 ${newTitle}`;

              useStore.setState({
                wins: [...wins],
              });
            }}
          >
            Rename
          </span>
        </div>
        <div className="w-full " style={{ height: "calc(100% - 30px)" }}>
          {/*  */}
        </div>
      </div>
    </>
  );
}
