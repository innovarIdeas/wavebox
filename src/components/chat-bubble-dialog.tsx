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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LeadSchema, leadSchema } from "@/lib/dtos";
import { createLead } from "@/api/chatService";
import { getCurrentLocation } from "@/lib/utils";

export interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatBubbleDialog() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(
    !!localStorage.getItem("leadData")
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

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

  const onSubmit = async (data: LeadSchema) => {
    try {
      const location = await getCurrentLocation();
      const enrichedData = { ...data, location: String(location) };
      createLead(enrichedData)
        .then(() => {
          console.log("Form submitted with data:", JSON.stringify(enrichedData));
          localStorage.setItem("leadData", JSON.stringify(enrichedData));
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="animate-bounce rounded-full fixed z-[9999] right-4 bottom-4 sm:right-6 sm:bottom-6 h-14 w-14">
          <BsChatQuote className="pointer-events-none size-[24px] shrink-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md flex flex-col">
        {!formSubmitted ? (
          <div>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Innovar Wavebox
              </DialogTitle>
              <DialogDescription>
                Please provide your details to start the chat.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g Alexi Stien" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g alexi.stien@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g +2341000000089" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div className="flex flex-col flex-grow overflow-y-auto p-4 bg-gray-100 rounded-lg scrollbar-hide h-[75vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Innovar Wavebox
              </DialogTitle>
              <DialogDescription className="text-center">
                Send your message(s) and get responses within seconds
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col flex-grow overflow-y-auto p-4 bg-gray-100 rounded-lg">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`my-2 p-3 rounded-lg w-fit ${msg.sender === "user"
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
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend}>
                <FiSend size={20} />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
