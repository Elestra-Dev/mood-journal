export type JwtUser = { sub: string; email: string };
export type Context = { user?: JwtUser | null };
