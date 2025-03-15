import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { IoMicOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiSendPlaneFill } from "react-icons/ri";
import { RxUpload } from "react-icons/rx";
import { FaUserAlt } from "react-icons/fa";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LeadSchema, leadSchema } from "@/lib/dtos";
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

function getRelativeTime(timestamp: string) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

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
      source: "WaveBox"
    },
  });

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      { message: inputValue.trim(), from: "VISITOR" },
    ]);
    setInputValue("");

    const leadData: LeadData | undefined = JSON.parse(
      localStorage.getItem("leadData") ?? ""
    );

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
    const leadData: LeadData | undefined = JSON.parse(
      localStorage.getItem("leadData") ?? ""
    );

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
      <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="rounded-full fixed z-[9999] right-4 bottom-4 sm:right-6 sm:bottom-6 h-14 w-14 bg-blue-600 hover:bg-blue-700"
      >
        <img
          src="./public/images/schoolwave.png"
          alt="Schoolwave Logo"
          className="size-[24px]"
        />
      </Button>

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[26rem] bg-white shadow-lg rounded-3xl flex flex-col mb-3">
          <div className="bg-blue-600 py-3 px-6 rounded-t-3xl text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="./public/images/schoolwave.png"
                alt="Schoolwave Logo"
                className="size-[24px]"
              />
              <h4 className="text-lg font-semibold mb-1">WaveBox</h4>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="rounded-full w-fit p-2 aspect-square bg-blue-700/50 hover:bg-blue-700"
            >
              <FaAngleDown className="size-[12px]" />
            </button>
          </div>
          <div className="">
            {!formSubmitted ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 p-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            className="focus-visible:ring-blue-600"
                            placeholder="e.g. Alexi Stien" {...field} />
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
                            className="focus-visible:ring-blue-600"
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
                          <Input className="focus-visible:ring-blue-600" placeholder="e.g. +1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Chat
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="flex flex-col space-y-4 h-[31rem]">
                <div className="p-6 flex flex-col space-y-2 overflow-y-auto min-h-72 h-full scrollbar-hide rounded-lg">
                  {messages.map((msg, index) => (
                    <div className="max-w-[18rem] w-fit">
                      <div className="flex items-baseline space-x-2">
                        {msg.from !== "VISITOR" && (
                          <img src="/path-to-your-logo.png" alt="Logo" className="w-5 h-5 rounded-full" />
                        )}
                        <div
                          key={index}
                          className={`p-4 rounded-2xl text-sm overflow-clip w-fit border-gray-200 border-solid border-[1px] text-black ${msg.from === "VISITOR"
                            ? " bg-gray-200/70 self-start"
                            : "bg-blue-100/70 self-end"
                            }`}
                        >
                          {msg.message}
                        </div>
                        {msg.from == "VISITOR" && (
                          <FaUserAlt className="h-3.5 w-3.5 text-gray-300 self-end" />
                        )}
                      </div>

                      <span className="bg-gray-300 rounded-full w-3 h-3"></span>

                      {msg.from !== "VISITOR" && (
                        <div className="text-[0.61rem] flex items-baseline gap-x-1.5 justify-start">
                          <span className="flex items-center">
                            <span className="text-gray-500">Wavebox</span>
                          </span>
                          <span className="text-gray-400 mt-1 ml-8">
                            {getRelativeTime(Date().toString())}
                          </span>
                        </div>
                      )}
                      {msg.from === "VISITOR" && (
                        <div className="text-[0.61rem] flex items-baseline gap-x-1.5 justify-end">
                          <span className="flex items-center">
                            <span className="text-gray-500">You</span>
                          </span>
                          <span className="text-gray-400 mt-1 mr-8">
                            {getRelativeTime(Date().toString())}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={bottomRef}></div>
                </div>
                <div className="h-fit py-2 overflow-y-clip text-blue-500 mx-2 flex overflow-x-scroll gap-x-2 scrollbar-hide cursor-pointer">
                  <p className="text-[0.63rem] rounded-full border-blue-500 border-[1px] w-fit h-fit py-1.5 px-2 text-nowrap hover:bg-blue-200/20">Do you want to book a meeting?</p>
                  <p className="text-[0.63rem] rounded-full border-blue-500 border-[1px] w-fit h-fit py-1.5 px-2 text-nowrap hover:bg-blue-200/20">Do you want to migrate to Schoolwave?</p>
                </div>
                <div className="p-4 flex items-center gap-2 mt-4 border-t-[1px] border-t-black">
                  <input
                    placeholder="Send message"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="outline-none w-full text-sm"
                  />
                  <span className="flex gap-x-3">
                    <IoMicOutline size={22} />
                    <RxUpload size={22} />
                    <RiSendPlaneFill size={22} onClick={handleSend} className="text-blue-600 rotate-45" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
