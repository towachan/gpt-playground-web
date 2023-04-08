import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std@0.182.0/http/cookie.ts";
import { validate } from "https://deno.land/std@0.182.0/uuid/v5.ts";

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const cookie = getCookies(req.headers);
  const { session } = cookie;

  if (session === null || (session !== null && !validate(session))) {
    return new Response(null, { status: 401 });
  }

  const resp = await ctx.next();
  return resp;
}
