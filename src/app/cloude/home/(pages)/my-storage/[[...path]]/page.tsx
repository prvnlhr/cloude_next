import FolderPage from "@/components/Layout/MainView/Pages/Common/FolderPage";
import { getStoragePageContent } from "@/lib/services/myStorage/myStorageService";
import { createClient } from "@/middlewares/supabase/server";

export default async function MyStorage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path = [] } = await params;
  /*
    params path can have:
    - ['files', 'fileId']
    - ['folders', 'folderId']
    - undefined
  */

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user.id;
  const folderId = path[0] === "folders" ? path[1] : null;

  const pageContent = await getStoragePageContent(userId, folderId);
  console.log(pageContent);

  const files = pageContent.files || [];
  const folders = pageContent.folders || [];

  return <FolderPage files={files} folders={folders} />;
}
