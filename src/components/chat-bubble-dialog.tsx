import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
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
import {
  LeadSchema,
  leadSchema,
} from "@/lib/dtos";
import { createLead, fetchMessages, sendMessage } from "@/api/chatService";
import { getCurrentLocation } from "@/lib/utils";

export interface Message {
  message: string;
  from: string;
}

type LeadType = {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  location: string;
  organization: string;
};

type ChatType = {
  id: string;
  name: string;
  organization_id: string;
  lead_id: string;
};

type LeadData = {
  lead: LeadType;
  chat: ChatType;
};

export default function ChatBubbleWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(
    !!localStorage.getItem("leadData")
  );
  const [isChatOpen, setIsChatOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [...prev, { message: inputValue.trim(), from: "VISITOR" }]);
    setInputValue("");

    const leadData: LeadData | undefined = JSON.parse(localStorage.getItem("leadData") ?? "");
    if (!leadData) {
      window.location.reload();
      return;
    }

    const messagePayload = {
      message: inputValue.trim(),
      organization_id: leadData.chat.organization_id,
      wavebox_chat_id: leadData.chat.id,
      wavebox_lead_id: leadData.lead.id,
    };

    try {
      await sendMessage(messagePayload);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const fetchMessagesInterval = setInterval(() => {
      if (formSubmitted) handleFetchMessages();
    }, 5000);
    return () => clearInterval(fetchMessagesInterval);
  }, [formSubmitted]);

  const handleFetchMessages = async () => {
    const leadData: LeadData | undefined = JSON.parse(localStorage.getItem("leadData") ?? "");
    if (!leadData) {
      window.location.reload();
      return;
    }

    try {
      const fetchMessagesPayload = {
        organization_id: leadData.chat.organization_id,
        wavebox_chat_id: leadData.chat.id,
        wavebox_lead_id: leadData.lead.id,
      };
      const messages = await fetchMessages(fetchMessagesPayload);
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data: LeadSchema) => {
    try {
      const location = await getCurrentLocation();
      const enrichedData = { ...data, location: String(location) };
      const response = await createLead(enrichedData);
      localStorage.setItem("leadData", JSON.stringify(response));
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsChatOpen(!isChatOpen)} className="rounded-full fixed z-[9999] right-4 bottom-4 sm:right-6 sm:bottom-6 h-14 w-14">
        {isChatOpen ? <IoClose className="size-[24px]" /> : <BsChatQuote className="size-[24px]" />}
      </Button>

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-full max-w-sm bg-white shadow-lg rounded-lg flex flex-col mb-3">
          <div className="bg-black p-6 rounded-t-lg text-white">
            <h4 className="text-sm mb-1"><span className="text-lg font-bold">InnovarIdeas</span> - Chat with our experts</h4>
            <p className="text-sm">Let's hear your voice, and let our experts attend to you</p>
          </div>
          <div className="p-4">
            {!formSubmitted ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Alexi Stien" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="e.g alexi.stien@gmail.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="e.g. +1234567890" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full">Start Chat</Button>
                </form>
              </Form>
            ) : (
              <div className="flex flex-col space-y-2 max-h-96 p-2">
                <div className="flex flex-col space-y-2 overflow-y-auto min-h-72 scrollbar-hide bg-gray-100 p-3 rounded-lg">
                  {messages.map((msg, index) => (
                    <div key={index} className={`p-2 rounded-lg max-w-[14rem] ${msg.from === "VISITOR" ? "bg-black text-white self-end" : "bg-gray-300 text-black self-start"}`}>
                      {msg.message}
                    </div>
                  ))}
                  <div ref={bottomRef}></div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Input placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                  <Button onClick={handleSend}><FiSend size={20} /></Button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
