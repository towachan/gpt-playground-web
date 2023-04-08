/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

await start(manifest, {
  port: config()["PORT"],
  plugins: [twindPlugin(twindConfig)],
});
