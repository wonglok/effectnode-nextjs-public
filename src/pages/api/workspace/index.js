import { auhtConfig } from "@/auth/auth";
import { Workspace } from "@/mongo/Workspace";
import { getDBConnection } from "@/mongo/mongo";
import { getServerSession } from "next-auth/next";

let connected = false;
export default async function API(req, res) {
  const session = await getServerSession(req, res, auhtConfig);

  if (session) {
    await getDBConnection();

    try {
      let bodyData = JSON.parse(req.body || "{}");
      let action = bodyData.action;
      let payload = bodyData.payload;
      console.log(payload);

      if (action === "listWorkspaces" && req.method === "POST") {
        //
        let data = await Workspace.find({}).then((r) => {
          console.log(r);
          return r;
        });

        return res.status(200).send({ data });
        //
      }
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
