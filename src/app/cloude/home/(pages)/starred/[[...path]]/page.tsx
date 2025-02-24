import FolderPage from "@/components/Layout/MainView/Pages/Common/FolderPage";

export default async function MyStorage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  console.log("path:", path);


  return <FolderPage />;
}
