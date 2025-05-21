import { useEffect, useRef, useState, useCallback } from "react"
import { FaAngleDown } from "react-icons/fa6"
import { IoMicOutline } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { RiSendPlaneFill } from "react-icons/ri"
import { RxUpload } from "react-icons/rx"
import { FaUserAlt } from "react-icons/fa"
import { FormControl, FormField, FormItem, Form, FormLabel, FormMessage } from "@/components/ui/form"
import { type LeadSchema, leadSchema } from "@/lib/dtos"
import { createLead, fetchMessages, sendMessage } from "@/api/chatService"
import { getCurrentLocation } from "@/lib/utils"
import { schoolwave } from "@/assets"
import { motion, AnimatePresence } from "framer-motion"
import notificationSound from "@/assets/notification-sound.mp3"

export interface Message {
  message: string
  from: string
}

type LeadType = {
  id: string
  name: string
  email: string
  phone_number: string
  location: string
  organization: string
}

type ChatType = {
  id: string
  name: string
  organization_id: string
  lead_id: string
}

type LeadData = {
  lead: LeadType
  chat: ChatType
}

type QuickMessage = {
  id: string
  text: string
}

function getRelativeTime(timestamp: string) {
  const now = new Date()
  const past = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

const playNotificationSound = async (audioElement: HTMLAudioElement | null) => {
  if (!audioElement) return;
  
  try {
    audioElement.currentTime = 0;
    
    const playPromise = audioElement.play();
    
    if (playPromise !== undefined) {
      await playPromise;
    }
  } catch (error) {
    console.error("Error playing notification sound:", error);
    
    if (error instanceof Error && error.name === "NotAllowedError") {
      console.error("Audio playback requires user interaction");
    }
  }
};

export default function ChatBubbleDialog({ slug }: { slug?: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(!!sessionStorage.getItem("leadData"))
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [previousMessageCount, setPreviousMessageCount] = useState(0)
  const [isNewMessage, setIsNewMessage] = useState(false)
  const [responderId, setResponderId] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const quickMessagesContainerRef = useRef<HTMLDivElement>(null)

  const quickMessages: QuickMessage[] = [
    { id: "1", text: "I want to book a meeting" },
    { id: "2", text: "I'm interested in migrating to Schoolwave" },
    { id: "3", text: "Tell me about your services" },
    { id: "4", text: "What are your pricing plans?" },
    { id: "5", text: "I'd like to see a demo" },
    { id: "6", text: "How are you different from competitors?" },
    { id: "7", text: "How do I get started?" },
    { id: "8", text: "What's the implementation timeline?" },
    { id: "9", text: "Is there a free trial available?" },
    { id: "10", text: "Can you help with migration?" },
  ]

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      source: "WaveBox",
      slug: ""
    },
    mode: "onChange",
  })

  const handleSend = async () => {
    if (!inputValue.trim()) return

    setMessages((prev) => [...prev, { message: inputValue.trim(), from: "VISITOR"}])
    setInputValue("")

    const leadData: LeadData | undefined = JSON.parse(sessionStorage.getItem("leadData") ?? "")

    if (!leadData) {
      window.location.reload()
      return
    }

    const messagePayload = {
      message: inputValue.trim(),
      organization_id: leadData.chat.organization_id,
      wavebox_chat_id: leadData.chat.id,
      wavebox_lead_id: leadData.lead.id,
      responder_id: responderId
    }

    try {
      await sendMessage(messagePayload)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleQuickMessageClick = (text: string) => {
    setInputValue(text)
  }

  const handleScroll = (direction: "left" | "right") => {
    if (quickMessagesContainerRef.current) {
      const scrollAmount = 200
      const container = quickMessagesContainerRef.current

      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  const handleFetchMessages = useCallback(async () => {
    const leadData: LeadData | undefined = JSON.parse(sessionStorage.getItem("leadData") ?? "")

    if (!leadData) {
      window.location.reload()
      return
    }

    try {
      const fetchMessagesPayload = {
        organization_id: leadData.chat.organization_id,
        wavebox_chat_id: leadData.chat.id,
        wavebox_lead_id: leadData.lead.id,
      }
      const newMessages = await fetchMessages(fetchMessagesPayload)

      if (newMessages.length > previousMessageCount) {
        const hasNewNonVisitorMessage =
          newMessages.length > messages.length && newMessages[newMessages.length - 1].from !== "VISITOR"

        if (hasNewNonVisitorMessage && isChatOpen) {
          await playNotificationSound(audioRef.current);
          setIsNewMessage(true);
          setTimeout(() => setIsNewMessage(false), 3000);
        }

        setPreviousMessageCount(newMessages.length)
      }

      setMessages(newMessages)
      // Find the last message with a non-null responder_id
      const lastResponderMessage = [...newMessages].reverse().find(msg => msg.responder_id !== null);
      if (lastResponderMessage) {
        setResponderId(lastResponderMessage.responder_id);
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }, [messages, previousMessageCount, isChatOpen])

  useEffect(() => {
    const fetchMessagesInterval = setInterval(() => {
      if (formSubmitted) handleFetchMessages()
    }, 5000)
    return () => clearInterval(fetchMessagesInterval)
  }, [formSubmitted, handleFetchMessages])

  

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const onSubmit = async (data: LeadSchema) => {
    try {
      // Get location if available
      let location = "Location not available"
      try {
        const geoResult = await getCurrentLocation()
        location = String(geoResult)
      } catch (geoError: Error | unknown) {
        console.warn(
          "Geolocation access denied or not available:",
          geoError instanceof Error ? geoError.message : String(geoError),
        )
      }
      
      // Make sure the slug from URL is included in the form data
      if (!slug) {
        console.error("No slug available. Cannot submit form without organization slug.");
        return;
      }
      
      const enrichedData = { 
        ...data, 
        location,
        slug
      }
      
      console.log("Submitting form with organization slug:", enrichedData.slug);
      
      const response = await createLead(enrichedData);
      sessionStorage.setItem("leadData", JSON.stringify(response));
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <div>
      <audio 
        ref={audioRef}
        src={notificationSound} 
        preload="auto"
        onError={(e) => console.error("Audio loading error:", e)}
      />

      <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="rounded-full fixed z-[9999] right-4 bottom-4 sm:right-6 sm:bottom-6 h-14 w-14 bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
      >
        <motion.div animate={{ rotate: isChatOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <img src={schoolwave || "/placeholder.svg"} alt="Schoolwave Logo" className="size-[24px]" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-20 right-4 sm:right-6 w-[26rem] bg-white shadow-lg rounded-3xl flex flex-col mb-3 overflow-hidden"
          >
            <div className="bg-blue-600 py-3 px-6 rounded-t-3xl text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.img
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isNewMessage ? [0, -10, 10, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                  src={schoolwave}
                  alt="Schoolwave Logo"
                  className="size-[24px]"
                />
                <h4 className="text-lg font-semibold mb-1">WaveBox</h4>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="rounded-full w-fit p-2 aspect-square bg-blue-700/50 hover:bg-blue-700 transition-colors duration-200"
              >
                <FaAngleDown className="size-[12px]" />
              </button>
            </div>
            <div className="">
              {!formSubmitted ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              className="focus-visible:ring-blue-600 transition-all duration-200"
                              placeholder="e.g. Alexi Stien"
                              {...field}
                            />
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
                              className="focus-visible:ring-blue-600 transition-all duration-200"
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
                            <Input
                              className="focus-visible:ring-blue-600 transition-all duration-200"
                              placeholder="e.g. +1234567890"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200">
                      Start Chat
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="flex flex-col space-y-4 h-[31rem]">
                  <div className="p-6 flex flex-col space-y-2 overflow-y-auto min-h-72 h-full scrollbar-hide rounded-lg">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-[18rem] w-fit"
                      >
                        <div className="flex items-baseline space-x-2">
                          {msg.from !== "VISITOR" && (
                            <img src={schoolwave || "/placeholder.svg"} alt="Logo" className="w-5 h-5 rounded-full" />
                          )}
                          <div
                            className={`p-4 rounded-2xl text-sm overflow-clip w-fit border-gray-200 border-solid border-[1px] text-black ${
                              msg.from === "VISITOR" ? " bg-gray-200/70 self-start" : "bg-blue-100/70 self-end"
                            }`}
                          >
                            {msg.message}
                          </div>
                          {msg.from == "VISITOR" && <FaUserAlt className="h-3.5 w-3.5 text-gray-300 self-end" />}
                        </div>

                        <span className="bg-gray-300 rounded-full w-3 h-3"></span>

                        {msg.from !== "VISITOR" && (
                          <div className="text-[0.61rem] flex items-baseline gap-x-1.5 justify-start">
                            <span className="flex items-center">
                              <span className="text-gray-500">Wavebox</span>
                            </span>
                            <span className="text-gray-400 mt-1 ml-8">{getRelativeTime(Date().toString())}</span>
                          </div>
                        )}
                        {msg.from === "VISITOR" && (
                          <div className="text-[0.61rem] flex items-baseline gap-x-1.5 justify-end">
                            <span className="flex items-center">
                              <span className="text-gray-500">You</span>
                            </span>
                            <span className="text-gray-400 mt-1 mr-8">{getRelativeTime(Date().toString())}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    <div ref={bottomRef}></div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => handleScroll("left")}
                      className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md"
                      aria-label="Scroll left"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-500"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>

                    <div
                      ref={quickMessagesContainerRef}
                      className="h-fit py-2 overflow-y-clip text-blue-500 mx-8 flex overflow-x-scroll gap-x-2 scrollbar-hide"
                    >
                      {quickMessages.map((msg) => (
                        <motion.p
                          key={msg.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickMessageClick(msg.text)}
                          className="text-[0.63rem] rounded-full border-blue-500 border-[1px] w-fit h-fit py-1.5 px-2 text-nowrap hover:bg-blue-200/20 cursor-pointer transition-colors duration-200"
                        >
                          {msg.text}
                        </motion.p>
                      ))}
                    </div>

                    <button
                      onClick={() => handleScroll("right")}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md"
                      aria-label="Scroll right"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-500"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
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
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <IoMicOutline
                          size={22}
                          className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        />
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <RxUpload
                          size={22}
                          className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        />
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <RiSendPlaneFill
                          size={22}
                          onClick={handleSend}
                          className="text-blue-600 rotate-45 cursor-pointer hover:text-blue-800 transition-colors duration-200"
                        />
                      </motion.div>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
