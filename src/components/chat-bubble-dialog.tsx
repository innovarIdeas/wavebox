import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BsChatQuote } from "react-icons/bs";

export interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatBubbleDialog() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = (): void => {
    if (inputValue.trim()) {
      setMessages((prev) => [...prev, { sender: "user", text: inputValue }]);
      setInputValue("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "This is a bot response." },
        ]);
      }, 1000);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="animate-bounce rounded-full fixed z-[9999] right-4 bottom-4 sm:right-6 sm:bottom-6 h-14 w-14">
          <BsChatQuote className="pointer-events-none size-[24px] shrink-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md h-[75vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Innovar Wavebox</DialogTitle>
          <DialogDescription>
            Send your message(s) and get responses within seconds
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col flex-grow overflow-y-auto p-4 bg-gray-100 rounded-lg scrollbar-hide">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 p-3 rounded-lg ${msg.sender === "user"
                  ? "bg-black text-white self-end"
                  : "bg-gray-300 text-black self-start"
                  }`}
              >
                {msg.text}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center mt-4">
              No messages yet. Start the conversation!
            </p>
          )}

          <div ref={bottomRef}></div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key == "Enter" && handleSend()}
          />
          <Button onClick={handleSend}><FiSend size={20} /></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
