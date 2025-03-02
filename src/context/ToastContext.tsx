"use client";
import { createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";

interface ToastContextType {
  showToast: (
    type: "loading" | "success" | "error",
    title: string,
    description?: string,
    toastId?: string | number
  ) => string | number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = (
    type: "loading" | "success" | "error",
    title: string,
    description?: string,
    toastId?: string | number
  ) => {
    if (type === "loading") {
      return toast.loading(title, { description, id: toastId });
    } else if (type === "success") {
      return toast.success(title, { description, id: toastId });
    } else if (type === "error") {
      return toast.error(title, { description, id: toastId });
    }
    return "";
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
