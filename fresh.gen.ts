// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[name].tsx";
import * as $1 from "./routes/happy/api/_middleware.ts";
import * as $2 from "./routes/happy/api/chat.ts";
import * as $3 from "./routes/happy/index.tsx";
import * as $4 from "./routes/happy/verify.tsx";
import * as $$0 from "./islands/Chat.tsx";

const manifest = {
  routes: {
    "./routes/[name].tsx": $0,
    "./routes/happy/api/_middleware.ts": $1,
    "./routes/happy/api/chat.ts": $2,
    "./routes/happy/index.tsx": $3,
    "./routes/happy/verify.tsx": $4,
  },
  islands: {
    "./islands/Chat.tsx": $$0,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
