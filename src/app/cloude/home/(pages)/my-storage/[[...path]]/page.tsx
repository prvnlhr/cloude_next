import FolderPage from "@/components/Layout/MainView/Pages/Common/FolderPage";

export default async function MyStorage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  // TODO : path can have ['files', 'fileId'] or  ['folders', 'folderId'] or ['files'] or ['folders'] or undefined
  console.log(path);

  return <FolderPage />;
}
