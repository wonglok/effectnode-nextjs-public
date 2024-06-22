import { Code } from "@/src/mongo/Code";

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
          listCodes.server(args),
          createCode.server(args),
          getOneCode.server(args),
          removeOneCode.server(args),
          renameOneCode.server(args),
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

export const listCodes = {
  server: async ({ req, res, action, payload }) => {
    if (action === "listCodes" && req.method === "POST") {
      //
      let data = await Code.find({}).then((r) => {
        console.log(r);
        return r;
      });

      res.status(200).send({ data });
      return true;
    }
  },
  client: (func = (v) => v) => {
    return fetch(`/api/Code`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "listCodes",
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

export const createCode = {
  server: async ({ req, res, action, payload }) => {
    if (action === "createCode" && req.method === "POST") {
      //
      let data = await Code.create({}).then((r) => {
        console.log(r);
        return r;
      });

      res.status(200).send({ data });
      return true;
    }
  },
  client: (data = {}, func = (v) => v) => {
    return fetch(`/api/Code`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "createCode",
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

export const getOneCode = {
  server: async ({ req, res, action, payload }) => {
    if (action === "getOneCode" && req.method === "POST") {
      //
      let data = await Code.findOne({
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
    return fetch(`/api/Code`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "getOneCode",
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

export const removeOneCode = {
  server: async ({ req, res, action, payload }) => {
    //
    if (action === "removeOneCode" && req.method === "POST") {
      //
      let data = await Code.findOneAndDelete({
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
    return fetch(`/api/Code`, {
      method: "post",
      body: JSON.stringify({
        //
        action: "removeOneCode",
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

export const renameOneCode = {
  server: async ({ req, res, action, payload }) => {
    if (action === "renameOneCode" && req.method === "POST") {
      //
      let data = await Code.findOneAndUpdate(
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
      fetch(`/api/Code`, {
        method: "post",
        body: JSON.stringify({
          //
          action: "renameOneCode",
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
