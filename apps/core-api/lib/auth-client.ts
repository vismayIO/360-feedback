import { createAuthClient } from "better-auth/client";
import type { auth } from "./auth.js";
import {
  inferAdditionalFields,
  usernameClient,
  emailOTPClient,
  adminClient,
  multiSessionClient,
} from "better-auth/client/plugins";
import { ac, roles } from "./permissions.js";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    inferAdditionalFields<typeof auth>(),
    usernameClient(),
    emailOTPClient(),
    adminClient({
      ac,
      roles,
    }),
    multiSessionClient(),
  ],
});
