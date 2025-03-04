import ContentPage from "@/components/Layout/MainView/Pages/Common/ContentPage";
import FilePage from "@/components/Layout/MainView/Pages/FilePage/FilePage";
import {
  fetchSharedContent,
  getSharedFile,
} from "@/lib/services/shared/sharedServices";
import { createClient } from "@/middlewares/supabase/server";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Params = Promise<{ path: string[] }>;

export default async function SharedPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { path = [] } = await params;
  const supabase = await createClient();
  const queryParams = Object.entries(await searchParams).length
    ? await searchParams
    : null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user!.id;
  const folderId = path[0] === "folders" ? path[1] : null;

  if (path[0] === "files") {
    const itemId = path[1];
    const file = await getSharedFile(userId, itemId);

    return <FilePage file={file} />;
  }
  const contentData = await fetchSharedContent(userId, folderId, queryParams);

  return (
    <ContentPage
      files={contentData?.files || []}
      folders={contentData?.folders || []}
    />
  );
}
