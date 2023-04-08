import { HandlerContext } from "$fresh/server.ts";
import { chatCompletiions, Message } from "../../services/openaiService.ts";

interface ChatBody {
  messages: Message[];
}

interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

interface ChatResp {
  choices: Choice[];
}

export const handler = {
  async POST(req: Request, _ctx: HandlerContext) {
    const chatBody: ChatBody = await req.json();
    const requestMessages = chatBody.messages.length > 5
      ? chatBody.messages.slice(Math.max(chatBody.messages.length - 5, 0))
      : chatBody.messages;

    try {
      const resp = await chatCompletiions(requestMessages);
      if (resp.status === 200) {
        const { choices }: ChatResp = await resp.json();
        if (choices[0] && choices[0].message) {
          return new Response(
            JSON.stringify({
              result: true,
              message: choices[0].message,
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
        }
      } else {
        throw new Error(resp.status.toString());
      }
    } catch (ex) {
      console.error(ex);
      return new Response(
        JSON.stringify({ result: false, error: "Fail to complete request." }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  },
};
