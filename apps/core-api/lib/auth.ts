import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  admin as adminPlugin,
  bearer,
  emailOTP,
  jwt,
  multiSession,
  username,
} from "better-auth/plugins";
import { prisma } from "./prisma";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  appName: "360-be",
  plugins: [
    jwt(),
    multiSession(),
    bearer(),
    adminPlugin({
      ac,
      roles,
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }, request) {
        // Send email with OTP
      },
    }),
    username(),
  ],
});

export type Session = typeof auth.$Infer.Session.session;
export type AuthUser = typeof auth.$Infer.Session.user;
