import express, { Request } from "express";
import cors from "cors";
import { json } from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { schema } from "./schema";
import { getUserFromReq } from "./auth/auth.context";
import { Context } from "./auth/auth.types";

export async function createApp() {
  const app = express();
  app.use(cors());
  app.use(json());

  const server = new ApolloServer<Context>({ schema });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }): Promise<Context> => ({
        user: getUserFromReq(req),
      }),
    })
  );

  app.get("/health", (_req, res) => res.json({ ok: true }));
  return app;
}
