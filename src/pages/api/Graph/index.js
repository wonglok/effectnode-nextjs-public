import { Graph } from "@/src/mongo/Graph";

export default async function API(req, res) {
  let { auhtConfig } = await import("@/src/auth/auth");
  let { getDBConnection } = await import("@/src/mongo/mongo");
  let { getServerSession } = await import("next-auth/next");

  const session = await getServerSession(req, res, auhtConfig);

  if (session) {
    try {
      let bodyData = JSON.parse(req.body || "{}");
      let action = bodyData.action;
      let payload = bodyData.payload;

      console.log("[action]", action, payload);

      await getDBConnection();

      try {
        let args = { req, res, action, payload };
        let operations = await Promise.all([
          //

          listGraphs.server(args),
          createGraph.server(args),
          getOneGraph.server(args),
          removeOneGraph.server(args),
          renameOneGraph.server(args),
          //
        ]).catch((r) => {
          console.error(r);
          res.status(500).send({
            error: "process bug",
          });
          return [];
        });
        let okCounter = operations.filter((r) => r);

        if (okCounter.length === 0) {
          res.status(404).send({
            error: "action not found",
          });
          throw new Error("not found");
        }
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        error: "process bug",
      });
    }
  } else {
    res.status(403).send({
      error: "not logged in",
    });
  }
}

export const listGraphs = {
  server: async ({ req, res, action, payload }) => {
    if (action === "listGraphs" && req.method === "POST") {
      //
      let data = await Graph.find({}).then((r) => {
        console.log(r);
        return r;
      });

      res.status(200).send({ data });
      return true;
    }
  },
  client: (func = (v) => v) => {
    return fetch(`/api/Graph`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "listGraphs",
        payload: {},
      }),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("server error");
        }
        return r.json();
      })
      .then(func)
      .catch((r) => {
        console.error(r);
      });
  },
};

export const createGraph = {
  server: async ({ req, res, action, payload }) => {
    if (action === "createGraph" && req.method === "POST") {
      //
      let data = await Graph.create({}).then((r) => {
        console.log(r);
        return r;
      });

      res.status(200).send({ data });
      return true;
    }
  },
  client: (data = {}, func = (v) => v) => {
    return fetch(`/api/Graph`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "createGraph",
        payload: data,
      }),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("server error");
        }
        return r.json();
      })
      .then(func)
      .catch((r) => {
        console.error(r);
      });
  },
};

export const getOneGraph = {
  server: async ({ req, res, action, payload }) => {
    if (action === "getOneGraph" && req.method === "POST") {
      //
      let data = await Graph.findOne({
        _id: payload._id,
      }).then((r) => {
        console.log(r);
        return r;
      });

      res.status(200).send({ data });
      return true;
    }
  },
  client: (data = {}, fnc = (v) => v) => {
    return fetch(`/api/Graph`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "getOneGraph",
        payload: data,
      }),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("server error");
        }
        return r.json();
      })
      .then(fnc)
      .catch((r) => {
        console.error(r);
      });
  },
};

export const removeOneGraph = {
  server: async ({ req, res, action, payload }) => {
    //
    if (action === "removeOneGraph" && req.method === "POST") {
      //
      let data = await Graph.findOneAndDelete({
        _id: payload._id,
      }).then((r) => {
        console.log(r);
        return r;
      });

      res.status(200).send({ data });
      return true;
    } else {
    }
  },
  client: (data = { _id: false }, func = (v) => v) => {
    return fetch(`/api/Graph`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "removeOneGraph",
        payload: data,
      }),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("server error");
        }
        return r.json();
      })
      .then(func)
      .catch((r) => {
        console.error(r);
      });
  },
};

export const renameOneGraph = {
  server: async ({ req, res, action, payload }) => {
    if (action === "renameOneGraph" && req.method === "POST") {
      //
      let data = await Graph.findOneAndUpdate(
        {
          _id: payload._id,
        },
        {
          title: payload.title,
        }
      ).then((r) => {
        console.log(r);
        return r;
      });

      res.status(200).send({ data });
      return true;
    }
  },
  client: (data = { _id: false, title: "new_name" }, func = (v) => v) => {
    return (
      fetch(`/api/Graph`, {
        method: "post",
        body: JSON.stringify({
          //
          action: "renameOneGraph",
          payload: data,
        }),
      })
        //
        .then((r) => {
          if (!r.ok) {
            throw new Error("server error");
          }
          return r.json();
        })
        .then(func)
        .catch((r) => {
          console.error(r);
        })
    );
  },
};
