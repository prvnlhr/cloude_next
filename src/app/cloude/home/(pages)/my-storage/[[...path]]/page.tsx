import ContentPage from "@/components/Layout/MainView/Pages/Common/ContentPage";
import FilePage from "@/components/Layout/MainView/Pages/FilePage/FilePage";
import { fetchUserStorageContent } from "@/lib/services/my_storage/myStorageServices";
import { getFile } from "@/lib/services/user/filesService";
import { createClient } from "@/middlewares/supabase/server";
import { ContentPageContent, File, Folder } from "@/types/contentTypes";
export default async function MyStorage({
  params,
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

  const userId = user!.id;

  if (path[0] === "files") {
    const fileId = path[1];
    const file = await getFile(userId, fileId);
    return <FilePage file={file} />;
  }

  const folderId = path[0] === "folders" ? path[1] : null;

  const pageContent: ContentPageContent = await fetchUserStorageContent(
    userId,
    folderId
  );
  const files: File[] = pageContent.files || [];
  const folders: Folder[] = pageContent.folders || [];

  return <ContentPage files={files} folders={folders} />;
}
