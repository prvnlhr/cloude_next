import ContentPage from "@/components/Layout/MainView/Pages/Common/ContentPage";
import { fetchStarredContent } from "@/lib/services/starred/starredService";
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

  const starredContent = await fetchStarredContent(userId, folderId);

  return (
    <ContentPage
      files={starredContent?.files || []}
      folders={starredContent?.folders || []}
    />
  );
}
