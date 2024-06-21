import { Workspace } from "@/mongo/Workspace";

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
          listWorkspaces.server(args),
          createWorkspace.server(args),
          getOneWorkspace.server(args),
          removeOneWorkspace.server(args),
          renameOneWorkspace.server(args),

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

export const listWorkspaces = {
  server: async ({ req, res, action, payload }) => {
    if (action === "listWorkspaces" && req.method === "POST") {
      //
      let data = await Workspace.find({}).then((r) => {
        console.log(r);
        return r;
      });

      res.status(200).send({ data });
      return true;
    }
  },
  client: (func = (v) => v) => {
    return fetch(`/api/workspace`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "listWorkspaces",
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

export const createWorkspace = {
  server: async ({ req, res, action, payload }) => {
    if (action === "createWorkspace" && req.method === "POST") {
      //
      let data = await Workspace.create({}).then((r) => {
        console.log(r);
        return r;
      });

      res.status(200).send({ data });
      return true;
    }
  },
  client: (data = {}, func = (v) => v) => {
    return fetch(`/api/workspace`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "createWorkspace",
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

export const getOneWorkspace = {
  server: async ({ req, res, action, payload }) => {
    if (action === "getOneWorkspace" && req.method === "POST") {
      //
      let data = await Workspace.findOne({
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
    return fetch(`/api/workspace`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "getOneWorkspace",
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

export const removeOneWorkspace = {
  server: async ({ req, res, action, payload }) => {
    //
    if (action === "removeOneWorkspace" && req.method === "POST") {
      //
      let data = await Workspace.findOneAndDelete({
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
    return fetch(`/api/workspace`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "removeOneWorkspace",
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

export const renameOneWorkspace = {
  server: async ({ req, res, action, payload }) => {
    if (action === "renameOneWorkspace" && req.method === "POST") {
      //
      let data = await Workspace.findOneAndUpdate(
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
      fetch(`/api/workspace`, {
        method: "post",
        body: JSON.stringify({
          //
          action: "renameOneWorkspace",
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
