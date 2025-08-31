import { prisma } from "../../db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { Context } from "../../auth/auth.types";

export const userResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: Context) => {
      if (!ctx.user) return null;
      return prisma.user.findUnique({ where: { id: ctx.user.sub } });
    }
  },
  Mutation: {
    register: async (_: unknown, { email, password }: { email: string; password: string }) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { email, password: hashed } });
      const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: "7d" });
      return { token, user };
    },
    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Invalid credentials");
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) throw new Error("Invalid credentials");
      const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: "7d" });
      return { token, user };
    }
  }
};
