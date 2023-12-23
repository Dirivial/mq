import NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ??= "";

function MyAdapter(): Adapter {
  const prisma = new PrismaClient();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const a = PrismaAdapter(prisma) as Adapter;
  return a;
}

authOptions.adapter = MyAdapter();

authOptions.providers = [
  GoogleProvider({    
    clientId: (GOOGLE_CLIENT_ID),
    clientSecret: (process.env.GOOGLE_CLIENT_SECRET ??= ""),
  }),
  DiscordProvider({
    clientId: (process.env.DISCORD_CLIENT_ID ??= ""),
    clientSecret: (process.env.DISCORD_CLIENT_SECRET ??= ""),
  }),
  EmailProvider({
    async sendVerificationRequest({ identifier: email, url }) {
      // Call the cloud Email provider API for sending emails
      // See https://docs.sendgrid.com/api-reference/mail-send/mail-send
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        body: JSON.stringify({
          personalizations: [{ to: [{ email }] }],
          from: { email: "alexander.kadeby@gmail.com" },
          subject: "Sign in to Your page",
          content: [
            {   
              type: "text/html",
              value: `Please click <a href="${url}">here</a> to authenticate.`,
            },
          ],
        }),
        headers: {
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
  })
];

export default NextAuth(authOptions);
