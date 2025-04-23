import { FetchActivePopupsSchema } from "@/lib/dtos";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export async function fetchActivePopups(data: FetchActivePopupsSchema) {
    try {
      const response = await fetch(`${baseURL}/api/pop-ups?path=${data.path}&isMobile=${data.isMobile}&isNewVisitor=${data.isNewVisitor}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        //   "Origin": `${String(baseURL)}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch active popups: ${response.statusText}`);
      }
  
      return response.json();
    } catch (error) {
      console.error(`Error occured: ${error}`);
  
      throw error;
    }
  }