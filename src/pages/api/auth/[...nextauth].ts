import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";

function MyAdapter(): Adapter {
  const prisma = new PrismaClient();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const a = PrismaAdapter(prisma) as Adapter;
  return a;
}

authOptions.adapter = MyAdapter();

authOptions.providers = [
  DiscordProvider({
    clientId: (process.env.DISCORD_CLIENT_ID ??= ""),
    clientSecret: (process.env.DISCORD_CLIENT_SECRET ??= ""),
  }),
  EmailProvider({
    async sendVerificationRequest({ identifier: email, url }) {
      // Call the cloud Email provider API for sending emails
      // See https://docs.sendgrid.com/api-reference/mail-send/mail-send
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        // The body format will vary depending on provider, please see their documentation
        // for further details.
        body: JSON.stringify({
          personalizations: [{ to: [{ email }] }],
          from: { email: "alexander.kadeby@gmail.com" },
          subject: "Sign in to Your page",
          content: [
            {
              type: "text/plain",
              value: `Please click here to authenticate - ${url}`,
            },
          ],
        }),
        headers: {
          // Authentication will also vary from provider to provider, please see their docs.
          Authorization: `Bearer ${process.env.SENDGRID_API}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { errors } = await response.json();
        throw new Error(JSON.stringify(errors));
      }
    },
  }),
];

export default NextAuth(authOptions);
