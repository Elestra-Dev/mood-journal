export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!
};

if (!env.DATABASE_URL || !env.JWT_SECRET) {
  throw new Error("Missing required env vars: DATABASE_URL or JWT_SECRET");
}
