import FolderPage from "@/components/Layout/MainView/Pages/Common/FolderPage";
import { getStarredContent } from "@/lib/services/starred/starredService";
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

  const starredContent = await getStarredContent(userId, folderId);
  console.log(" starredContent:", starredContent);

  return (
    <FolderPage
      files={starredContent?.files || []}
      folders={starredContent?.folders || []}
    />
  );
}
