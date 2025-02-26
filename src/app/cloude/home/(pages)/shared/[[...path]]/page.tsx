import ContentPage from "@/components/Layout/MainView/Pages/Common/ContentPage";
import { fetchSharedContent } from "@/lib/services/shared/sharedServices";
import { createClient } from "@/middlewares/supabase/server";

interface File {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  created_at: string;
  folder_id: string;
  is_shared: boolean;
  is_starred: boolean;
  storage_path: string;
  thumbnail_url: string | null;
  updated_at: string;
  user_id: string;
}

interface Folder {
  id: string;
  folder_name: string;
  created_at: string;
  is_shared: boolean;
  is_starred: boolean;
  parent_folder_id: string | null;
  slug: string;
  updated_at: string;
  user_id: string;
}

interface SharedContentData {
  folders?: Folder[];
  files?: File[];
}

export default async function SharedPage({
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

  const contentData = await fetchSharedContent(userId, folderId);
  return (
    <ContentPage
      files={contentData?.files || []}
      folders={contentData?.folders || []}
    />
  );
}
