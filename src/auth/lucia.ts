import type { RequestEventBase } from "@builder.io/qwik-city";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { lucia } from "lucia";
import { qwik } from "lucia/middleware";
import tursoClient from "~/utils/tursoClient";

let _auth: ReturnType<typeof _lucia> | null = null;

const _lucia = (env: RequestEventBase["env"]) =>
  lucia({
    env: import.meta.env.MODE !== "production" ? "DEV" : "PROD",
    middleware: qwik(),
    adapter: libsql(tursoClient(env), {
      user: "profiles",
      key: "user_key",
      session: "user_session",
    }),
    getUserAttributes: (user) => {
      return {
        email: user.email,
        phone: user.phone,
        last_signed_in: user.last_signed_in,
        role: user.role,
        stripe_id: user.stripe_id,
        created_at: user.created_at,
      };
    },
    getSessionAttributes: (session) => {
      return {
        created_at: session.created_at,
      };
    },
  });

export const auth = ({ env }: RequestEventBase) => {
  if (_auth) return _auth;
  _auth = _lucia(env);
  return _auth;
};

export type Auth = ReturnType<typeof auth>;
