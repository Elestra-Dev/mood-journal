import { prisma } from "../../db/client";
import { requireAuth } from "../../auth/auth.guard";
import { Context } from "../../auth/auth.types";
import { upsertMoodSchema, deleteMoodSchema } from "./mood.validation";
import { normalizeToUTCStartOfDay, emojiScore } from "./mood.util";

export const moodResolvers = {
  Query: {
    moods: async (_: unknown, args: { rangeStart?: Date; rangeEnd?: Date }, ctx: Context) => {
      const user = requireAuth(ctx);
      const where: any = { userId: user.sub };
      if (args.rangeStart || args.rangeEnd) {
        where.day = {};
        if (args.rangeStart) where.day.gte = normalizeToUTCStartOfDay(args.rangeStart);
        if (args.rangeEnd) where.day.lte = normalizeToUTCStartOfDay(args.rangeEnd);
      }
      return prisma.mood.findMany({ where, orderBy: { day: "desc" } });
    },
    stats: async (_: unknown, { month, year }: { month: number; year: number }, ctx: Context) => {
      const user = requireAuth(ctx);
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
      const moods = await prisma.mood.findMany({
        where: { userId: user.sub, day: { gte: start, lte: end } }
      });
      const counts: Record<string, number> = {};
      let totalScore = 0;
      for (const m of moods) {
        counts[m.emoji] = (counts[m.emoji] ?? 0) + 1;
        totalScore += emojiScore[m.emoji] ?? 0.5;
      }
      const countsByEmoji = Object.entries(counts).map(([emoji, count]) => ({ emoji, count }));
      const averageScore = moods.length ? totalScore / moods.length : 0;
      return { total: moods.length, countsByEmoji, averageScore };
    }
  },
  Mutation: {
    upsertMood: async (_: unknown, { input }: any, ctx: Context) => {
      const user = requireAuth(ctx);
      const parsed = upsertMoodSchema.parse(input);
      const day = normalizeToUTCStartOfDay(parsed.day);

      const existing = await prisma.mood.findUnique({
        where: { userId_day: { userId: user.sub, day } }
      });

      if (existing) {
        return prisma.mood.update({
          where: { id: existing.id },
          data: { emoji: parsed.emoji, note: parsed.note }
        });
      }
      return prisma.mood.create({
        data: { day, emoji: parsed.emoji, note: parsed.note, userId: user.sub }
      });
    },
    deleteMood: async (_: unknown, args: any, ctx: Context) => {
      const user = requireAuth(ctx);
      const { day } = deleteMoodSchema.parse(args);
      const d = normalizeToUTCStartOfDay(day);
      const existing = await prisma.mood.findUnique({
        where: { userId_day: { userId: user.sub, day: d } }
      });
      if (!existing) return false;
      await prisma.mood.delete({ where: { id: existing.id } });
      return true;
    }
  }
};
