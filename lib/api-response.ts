export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function createApiResponse<T>(success: boolean, data?: T, error?: string, message?: string): ApiResponse<T> {
  return {
    success,
    data,
    error,
    message,
  }
}

export function handleApiError(error: any): ApiResponse {
  console.error("API Error:", error)
  return createApiResponse(false, null, error.message || "An unexpected error occurred")
}
