/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints.
 * Uses environment variables for flexibility across environments.
 */

// Base URL from environment variable, fallback to relative path for same-origin
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * Build full API URL with query parameters
 */
export function buildApiUrl(
  endpoint: string,
  params: Record<string, string>
): string {
  const url = new URL(endpoint, API_BASE_URL.startsWith("http") 
    ? API_BASE_URL 
    : `${window.location.origin}${API_BASE_URL}`
  );
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
}

/**
 * Standard fetch wrapper with error handling
 */
export async function apiFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
