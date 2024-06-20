import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const auhtConfig = {
  providers: [
    // OAuth authentication providers...
    Credentials({
      id: "credentials",
      name: "EV",
      type: "credentials",
      credentials: {
        username: {
          label: "Username (Vercel Environment Variable)",
          type: "text",
          placeholder: "ninja-developer",
        },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = {
          id: "root",
          name: "Developer",
          email: "developer@website.com",
        };

        if (
          credentials.username === process.env.LOGIN_USERNAME &&
          credentials.password === process.env.LOGIN_PASSWORD
        ) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],

  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"
    brandColor: "#00ffff", // Hex color code
    logo: "", // Absolute URL to image
    buttonText: "Login", // Hex color code
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, auhtConfig);
}

export async function doSSR(context) {
  const session = await getServerSession(context.req, context.res, auhtConfig);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
