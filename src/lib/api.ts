import { MarketingData, ApiResponse } from "../types/marketing";

// Function to get the correct base URL for API calls
function getApiBaseUrl(): string {
  // In production, use the environment variable
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_API_URL || "";
  }

  // For server-side rendering in development
  if (typeof window === "undefined") {
    return "http://localhost:3000";
  }

  // For client-side in development
  return "";
}

export async function fetchMarketingData(): Promise<MarketingData> {
  try {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/marketing-data`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Disable caching for development
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MarketingData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching marketing data:", error);
    throw new Error(
      `Failed to fetch marketing data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Client-side fetch function for use in components
export async function fetchMarketingDataClient(): Promise<MarketingData> {
  try {
    const response = await fetch("/api/marketing-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: ApiResponse = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: MarketingData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching marketing data:", error);
    throw error;
  }
}
