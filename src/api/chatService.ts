import { CreateWaveboxMessageSchema, FetchMessagesSchema, LeadSchema } from "@/lib/dtos";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export async function createLead(data: LeadSchema) {
  try {
    const response = await fetch(`${baseURL}/api/leads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": `${String(baseURL)}`
        },
        body: JSON.stringify(data)
      });

    if (!response.ok) {
      throw new Error(`Failed to create lead: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error occured: ${error}`);

    throw error;
  }
}

export async function sendMessage(data: CreateWaveboxMessageSchema) {
  try {
    const response = await fetch(`${baseURL}/api/website-messaging`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": `${String(baseURL)}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error occured: ${error}`);

    throw error;
  }
}

export async function fetchMessages(data: FetchMessagesSchema) {
  try {
    const response = await fetch(`${baseURL}/api/website-messaging?organization_id=${data.organization_id}&wavebox_chat_id=${data.wavebox_chat_id}&wavebox_lead_id=${data.wavebox_lead_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Origin": `${String(baseURL)}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error occured: ${error}`);

    throw error;
  }
}
