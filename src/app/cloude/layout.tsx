import AppLayout from "@/components/Layout/AppLayout";

export default function CloudeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-orange-500">
      <AppLayout>{children}</AppLayout>
    </div>
  );
}
