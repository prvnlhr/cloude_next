import HomeLayout from "../../../components/Layout/HomeLayout";

export default function HomeLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <HomeLayout>{children}</HomeLayout>
    </div>
  );
}
