import ContentPage from "@/components/Layout/MainView/Pages/Common/ContentPage";
import FilePage from "@/components/Layout/MainView/Pages/FilePage/FilePage";
import { fetchStarredContent } from "@/lib/services/starred/starredService";
import { getFile } from "@/lib/services/user/filesService";
import { createClient } from "@/middlewares/supabase/server";

export default async function MyStorage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path = [] } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user.id;
  const folderId = path[0] === "folders" ? path[1] : null;

  if (path[0] === "files") {
    const itemId = path[1];
    const file = await getFile(userId, itemId);
    return <FilePage file={file} />;
  }

  const starredContent = await fetchStarredContent(userId, folderId);
  // console.log(" starredContent:", starredContent);

  return (
    <ContentPage
      files={starredContent?.files || []}
      folders={starredContent?.folders || []}
    />
  );
}
