import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../components/Button.tsx";
import Input from "../components/Input.tsx";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { setCookie } from "https://deno.land/std@0.182.0/http/cookie.ts";
import { v5 } from "https://deno.land/std@0.182.0/uuid/mod.ts";

interface Data {
  name: string;
  error: string;
}

interface Result {
  valid: boolean;
}

const namespace: string = config()["NAME_SPACE"];

export const handler: Handlers<Data> = {
  GET(_, ctx) {
    return ctx.render({ name: "", error: "" });
  },

  async POST(req, ctx) {
    const formData = await req.formData();
    const name = formData.get("name");

    if (name !== "") {
      let resp;
      try {
        console.log(`name = ${name}`);
        const url = new URL(req.url);
        url.pathname = "/api/auth";
        resp = await fetch(url, {
          method: "POST",
          body: JSON.stringify({ name }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (e) {
        console.error("fail to auth - ", e);
        return ctx.render({
          name: name ? name.toString() : "",
          error: "Fail to check name.",
        });
      }

      if (resp.status === 200) {
        const url = new URL(req.url);
        const headers = new Headers();
        setCookie(headers, {
          name: "session",
          value: await v5.generate(
            namespace,
            new TextEncoder().encode(name?.toString()),
          ),
          maxAge: 3600,
          sameSite: "Lax",
          domain: url.hostname,
          path: "/",
          secure: true,
        });

        headers.set("location", "/");
        return new Response(null, {
          status: 303,
          headers,
        });
      }
      return ctx.render({ name: "", error: "User name is not good." });
    }
    return ctx.render({ name: "", error: "" });
  },
};

export default function Page({ data }: PageProps<Data>) {
  const { error, name } = data;
  console.log(name);

  return (
    <div class="flex-col just-center">
      <div class="p-5 m-5 flex justify-center">
        <form method={"post"}>
          <Input type="text" name="name" value={name} />
          <Button type="submit">
            GO!
          </Button>
        </form>
      </div>
      {error && <p class="text-center">{error}</p>}
    </div>
  );
}
