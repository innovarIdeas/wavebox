import { LeadSchema } from "@/lib/dtos";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export async function createLead(data: LeadSchema) {
  fetch(`${baseURL}/api/leads`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": `${String(baseURL)}`
      },
      body: JSON.stringify(data)
    })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to create lead: ${response.statusText}`);
      }
      const lead = await response.json();
      console.log(`Lead created successfully: ${JSON.stringify(lead)}`);
    })
    .catch(error => console.error(`Error occured ${error}`));
}

// write the function to consume the schoolwave chat system api to send and recieve messages
