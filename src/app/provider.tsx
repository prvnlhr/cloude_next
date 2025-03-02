"use client";
import { ToastProvider } from "@/context/ToastContext";
import { HeroUIProvider } from "@heroui/system";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider>{children}</ToastProvider>
    </HeroUIProvider>
  );
}
