import FolderPage from "@/components/Layout/MainView/Pages/Common/FolderPage";
import { getStoragePageContent } from "@/lib/services/myStorage/myStorageService";
import { createClient } from "@/middlewares/supabase/server";

export default async function MyStorage({
  params,
  searchParams,
}: {
  params: Promise<{ path: string }>;
}) {
  /*
  params path can have:
  - ['files', 'fileId']
  - ['folders', 'folderId']
  - undefined
  */

  const { path = [] } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user.id;
  const folderId = path[0] === "folders" ? path[1] : null;

  const pageContent = await getStoragePageContent(userId, folderId);

  const files = pageContent.files || [];
  const folders = pageContent.folders || [];

  return (
    <FolderPage files={files} folders={folders} searchParams={searchParams} />
  );
}
