export default async function API(req, res) {
  let { auhtConfig } = await import("@/auth/auth");
  let { Workspace } = await import("@/mongo/Workspace");
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

      if (action === "listWorkspaces" && req.method === "POST") {
        //
        let data = await Workspace.find({}).then((r) => {
          console.log(r);
          return r;
        });

        return res.status(200).send({ data });
      }

      if (action === "createWorkspace" && req.method === "POST") {
        //
        let data = await Workspace.create({}).then((r) => {
          console.log(r);
          return r;
        });

        return res.status(200).send({ data });
      }

      if (action === "getOneWorkspace" && req.method === "POST") {
        //
        let data = await Workspace.findOne({
          _id: payload._id,
        }).then((r) => {
          console.log(r);
          return r;
        });

        return res.status(200).send({ data });
      }
      //
      //
      // res.status(200).send([]);

      res.status(404).send({
        error: "action not found",
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        error: "process bug",
      });
    }
  } else {
    res.status(500).send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
}

export const listWorkspaces = (func = (v) => v) => {
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
};

export const createWorkspace = (data = {}, func = (v) => v) => {
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
};

export const getOneWorkspace = (data = {}, func = (v) => v) => {
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
    .then(func)
    .catch((r) => {
      console.error(r);
    });
};
