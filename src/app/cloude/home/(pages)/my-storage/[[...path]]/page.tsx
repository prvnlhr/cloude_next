import ContentPage from "@/components/Layout/MainView/Pages/Common/ContentPage";
import { fetchUserStorageContent } from "@/lib/services/my_storage/myStorageServices";
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
  let files = [];
  let folders = [];

  const pageContent = await fetchUserStorageContent(userId, folderId);
  files = pageContent.files || [];
  folders = pageContent.folders || [];

  return (
    <ContentPage files={files} folders={folders} searchParams={searchParams} />
  );
}
