import { auhtConfig } from "@/auth/auth";
import { getServerSession } from "next-auth/next";

export default async function API(req, res) {
  const session = await getServerSession(req, res, auhtConfig);
  if (session) {
    res.status(200).send({
      name: session.user.name,
      content:
        "This is protected content. You can access this content because you are signed in.",
    });
  } else {
    res.status(500).send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
}
