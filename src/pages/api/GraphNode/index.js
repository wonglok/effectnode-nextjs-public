import { GraphNode } from "@/mongo/GraphNode";

export default async function API(req, res) {
  let { auhtConfig } = await import("@/auth/auth");
  let { getDBConnection } = await import("@/mongo/mongo");
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
          listGraphNodes.server(args),
          createGraphNode.server(args),
          getOneGraphNode.server(args),
          removeOneGraphNode.server(args),
          renameOneGraphNode.server(args),

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

export const listGraphNodes = {
  server: async ({ req, res, action, payload }) => {
    if (action === "listGraphNodes" && req.method === "POST") {
      //
      let data = await GraphNode.find({}).then((r) => {
        console.log(r);
        return r;
      });

      res.status(200).send({ data });
      return true;
    }
  },
  client: (func = (v) => v) => {
    return fetch(`/api/GraphNode`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "listGraphNodes",
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

export const createGraphNode = {
  server: async ({ req, res, action, payload }) => {
    if (action === "createGraphNode" && req.method === "POST") {
      //
      let data = await GraphNode.create({}).then((r) => {
        console.log(r);
        return r;
      });

      res.status(200).send({ data });
      return true;
    }
  },
  client: (data = {}, func = (v) => v) => {
    return fetch(`/api/GraphNode`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "createGraphNode",
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

export const getOneGraphNode = {
  server: async ({ req, res, action, payload }) => {
    if (action === "getOneGraphNode" && req.method === "POST") {
      //
      let data = await GraphNode.findOne({
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
    return fetch(`/api/GraphNode`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "getOneGraphNode",
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

export const removeOneGraphNode = {
  server: async ({ req, res, action, payload }) => {
    //
    if (action === "removeOneGraphNode" && req.method === "POST") {
      //
      let data = await GraphNode.findOneAndDelete({
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
    return fetch(`/api/GraphNode`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "removeOneGraphNode",
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

export const renameOneGraphNode = {
  server: async ({ req, res, action, payload }) => {
    if (action === "renameOneGraphNode" && req.method === "POST") {
      //
      let data = await GraphNode.findOneAndUpdate(
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
      fetch(`/api/GraphNode`, {
        method: "post",
        body: JSON.stringify({
          //
          action: "renameOneGraphNode",
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
