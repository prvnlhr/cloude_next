import ContentPage from "@/components/Layout/MainView/Pages/Common/ContentPage";
import SharedContentPage from "@/components/Layout/MainView/Pages/SharedFilesPage/SharedByMeContentPage";
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
  searchParams,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path = [] } = await params;
  const supabase = await createClient();
  const queryParams = Object.entries(await searchParams).length
    ? await searchParams
    : null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user.id;
  const folderId = path[0] === "folders" ? path[1] : null;

  const contentData = await fetchSharedContent(userId, folderId, queryParams);
  console.log("queryParams", queryParams);
  return (
    <>
      {/* {queryParams ? (
        <SharedContentPage
          files={contentData?.files || []}
          folders={contentData?.folders || []}
        />
      ) : (
        <SharedContentPage
          files={contentData?.files || []}
          folders={contentData?.folders || []}
        />
      )} */}

      <ContentPage
        files={contentData?.files || []}
        folders={contentData?.folders || []}
      />
    </>
  );
}
