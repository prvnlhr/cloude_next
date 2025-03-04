export type ApiResponse<T = any> = {
    status: number;
    data?: T;
    error?: string | null;
    message?: string | null;
  };