export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-[100%] h-[100%] bg-white">{children}</div>;
}
