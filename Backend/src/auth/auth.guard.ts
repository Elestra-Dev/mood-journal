import { GraphQLError } from "graphql";
import { Context } from "./auth.types";

export function requireAuth(ctx: Context) {
  if (!ctx.user) {
    throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHORIZED" } });
  }
  return ctx.user;
}
