import { ApiResponse } from "@/types/apiResponse";

export const createResponse = <T>(
  status: number,
  data: T | null = null,
  error: string | null = null,
  message: string | null = null
): Response => {
  const response: ApiResponse<T> = { status, data, error, message };
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
