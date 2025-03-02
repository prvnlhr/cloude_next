import { createClient } from "@/middlewares/supabase/server";

const isValidUUID = (id) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const searchKey = searchParams.get("searchKey")?.trim();
  const userId = searchParams.get("userId");

  if (!searchKey || !userId) {
    return new Response(JSON.stringify({ error: "Missing parameters" }), {
      status: 400,
    });
  }

  const supabase = await createClient();

  try {
    // Fetch user's own files
    const { data: files, error: filesError } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", userId)
      .ilike("file_name", `%${searchKey}%`);
    if (filesError) throw filesError;

    // Fetch user's own folders
    const { data: folders, error: foldersError } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", userId)
      .ilike("folder_name", `%${searchKey}%`);
    if (foldersError) throw foldersError;

    // Fetch shared items
    const { data: sharedItems, error: sharedError } = await supabase
      .from("share_items")
      .select("*")
      .eq("shared_with", userId);
    if (sharedError) throw sharedError;

    // Extract valid shared file & folder IDs
    const sharedFileIds = [];
    const sharedFolderIds = [];

    sharedItems.forEach((item) => {
      if (item.file_id && isValidUUID(item.file_id))
        sharedFileIds.push(item.file_id);
      if (item.folder_id && isValidUUID(item.folder_id))
        sharedFolderIds.push(item.folder_id);
    });

    // Fetch shared files
    let sharedFiles = [];
    if (sharedFileIds.length > 0) {
      const { data: sharedFilesData, error: sharedFilesError } = await supabase
        .from("files")
        .select("*")
        .in("id", sharedFileIds)
        .ilike("file_name", `%${searchKey}%`);
      if (sharedFilesError) throw sharedFilesError;
      sharedFiles = sharedFilesData;
    }

    // Fetch shared folders
    let sharedFolders = [];
    if (sharedFolderIds.length > 0) {
      const { data: sharedFoldersData, error: sharedFoldersError } =
        await supabase
          .from("folders")
          .select("*")
          .in("id", sharedFolderIds)
          .ilike("folder_name", `%${searchKey}%`);
      if (sharedFoldersError) throw sharedFoldersError;
      sharedFolders = sharedFoldersData;
    }

    // Format the items
    const formatFiles = (items) =>
      items.map((item) => ({
        item_id: item.id,
        name: item.file_name,
        type: "file",
        is_shared: false,

        extension: item.extension,
      }));

    const formatFolders = (items) =>
      items.map((item) => ({
        item_id: item.id,
        name: item.folder_name,
        type: "folder",
        is_shared: false,
        extension: "folder",
      }));

    const formatSharedItems = (items, itemType) =>
      items.map((item) => ({
        item_id: item.id,
        item_type: itemType,
        is_shared: true,
        name: itemType === "file" ? item.file_name : item.folder_name,
        extension: itemType === "file" ? item.extension : "folder",
        type: itemType,
      }));

    const result = {
      files: formatFiles(files),
      folders: formatFolders(folders),
      shared_items: [
        ...formatSharedItems(sharedFiles, "file"),
        ...formatSharedItems(sharedFolders, "folder"),
      ],
    };

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Search Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
