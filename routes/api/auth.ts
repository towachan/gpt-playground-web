import { HandlerContext } from "$fresh/server.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

interface AuthBody {
  name: string;
}

const users: string[] = config()["USERS"].split(",");

export const handler = {
  async POST(req: Request, _ctx: HandlerContext) {
    // console.log(req);
    const body: AuthBody = await req.json();

    if (users.includes(body.name)) {
      return new Response(null, { status: 200 });
    } else {
      return new Response(null, { status: 403 });
    }
  },
};
