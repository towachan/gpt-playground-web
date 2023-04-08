import { useEffect, useRef, useState } from "preact/hooks";
import IconAlertCircle from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/alert-circle.tsx";
import { Message } from "../services/openaiService.ts";

export default function Chat() {
  const messagesContainer = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const container = messagesContainer.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length]);

  const send = async () => {
    setError("");
    if (input === "") {
      return;
    }

    setTyping(true);
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const resp = await fetch("/happy/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: newMessages }),
    });
    setTyping(false);

    if (resp.status === 401) {
      window.location.pathname = "/happy/verify";
    } else {
      const { result, message, error } = await resp.json();
      if (result && message) {
        setMessages([...newMessages, message]);
      } else if (error) {
        setError(error);
      }
    }
  };

  return (
    <div
      class={"flex flex-col justify-center items-center w-full h-screen children:bg-[#F9F9F9] children:border-1 children:border-gray-300"}
    >
      {error && (
        <div class="w-5/6 md:w-3/5 h-1/32 !bg-red-400 mb-1 p-1 flex rounded-md ">
          <IconAlertCircle />
          <span>Process failed...</span>
        </div>
      )}
      <div class="w-5/6 md:w-3/5 h-5/6 rounded-2xl mb-5 pl-6 flex flex-col pt-4 pb-2 pr-2">
        <div
          class="flex-auto overflow-y-scroll"
          ref={messagesContainer}
        >
          {messages.map((msg) => <Message message={msg} />)}
        </div>

        <div class="h-6 mt-1">
          {typing && (
            <div class="text-sm text-gray-400">
              Typing...
            </div>
          )}
        </div>
      </div>
      <div class="w-5/6 md:w-3/5 h-16 flex-none rounded-full flex items-center">
        <ChatInput
          input={input}
          onInput={(input) => setInput(input)}
          onSend={send}
          typing={typing}
        />
      </div>
    </div>
  );
}

function ChatInput({ input, onInput, onSend, typing }: {
  input: string;
  onInput: (input: string) => void;
  onSend: () => void;
  typing: boolean;
}) {
  return (
    <>
      <input
        type="text"
        placeholder="Message"
        class="block mx-6 w-full bg-transparent outline-none focus:text-gray-700"
        value={input}
        onInput={(e) => onInput(e.currentTarget.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button
        onClick={onSend}
        class="mx-3 p-2 hover:bg-gray-200 rounded-2xl"
        disabled={typing}
      >
        <svg
          class="w-5 h-5 text-gray-500 origin-center transform rotate-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </>
  );
}

function Message({ message }: { message: Message }) {
  const isBot = message.role === "assistant";
  return (
    <div
      class={`flex ${isBot ? "" : "flex-row-reverse mr-4 flex-col"} mb-4.5`}
    >
      <div>
        <p
          class={`flex items-baseline mb-0.5 ${
            isBot ? "" : "flex-row-reverse"
          }`}
        >
          {
            <span class="font-normal text-xs">
              {message.role === "assistant" ? "Bot" : "Me"}
            </span>
          }
        </p>
        <div
          class={`bg-[${
            isBot ? "#8BC1D8" : "#5BC0BE"
          }] pt-1.5 pb-1.5 pl-2.5 pr-2.5 rounded-md`}
        >
          <p class="text-sm text-gray-800" style={{ overflowWrap: "anywhere" }}>
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
