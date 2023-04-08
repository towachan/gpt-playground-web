import { Head } from "$fresh/runtime.ts";
import Chat from "../../islands/Chat.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>GRT playground</title>
      </Head>
      <div class="mx-auto max-w-screen-md">
        <Chat />
      </div>
    </>
  );
}
