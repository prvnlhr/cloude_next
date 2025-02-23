export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-[80%] h-[80%] bg-blue-400">{children}</div>;
}
