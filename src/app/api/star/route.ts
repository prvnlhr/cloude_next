import { createClient } from "@/middlewares/supabase/server";

const createResponse = (status, data = null, error = null, message = null) => {
  return new Response(JSON.stringify({ status, data, error, message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

//  POST : Add an item to starred -------------------------------------------------------------------------------------------------
export async function POST(req) {
  try {
    const supabase = await createClient();

    const { itemId, itemType, userId, itemOwnerId } = await req.json();

    if (!itemId || !itemType || !userId || !itemOwnerId) {
      return createResponse(400, null, "All fields are required.");
    }

    const { data: existingStar, error: checkError } = await supabase
      .from("starred_items")
      .select("id")
      .eq(itemType === "file" ? "file_id" : "folder_id", itemId)
      .eq("item_type", itemType)
      .eq("starred_by", userId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing star:", checkError);
      return createResponse(500, null, "Error checking existing star.");
    }

    if (existingStar) {
      return createResponse(409, null, "Item is already added to Starred.");
    }

    const shared = itemOwnerId !== userId;

    const insertData = {
      starred_by: userId,
      item_type: itemType,
      file_id: itemType === "file" ? itemId : null,
      folder_id: itemType === "folder" ? itemId : null,
      is_shared: shared,
      shared_by: shared ? itemOwnerId : null,
    };

    // Insert the starred item
    const { data: starredItem, error: insertError } = await supabase
      .from("starred_items")
      .insert([insertData])
      .single();

    if (insertError) {
      console.error("Error inserting starred item:", insertError);
      return createResponse(500, null, "Failed to mark item as starred.");
    }

    const updateTable = itemType === "file" ? "files" : "folders";

    const { error: updateError } = await supabase
      .from(updateTable)
      .update({ is_starred: true })
      .eq("id", itemId);

    if (updateError) {
      console.error("Error updating is_starred in table:", updateError);
      return createResponse(
        500,
        null,
        "Failed to update is_starred in the respective table."
      );
    }

    return createResponse(
      200,
      starredItem,
      null,
      "Item added to Starred successfully."
    );
  } catch (error) {
    console.error("Error at Star file POST:", error);
    return createResponse(
      500,
      null,
      error.message,
      "An unexpected error occurred while marking the item as starred."
    );
  }
}

// GET : all starred items -----------------------------------------------------------------------------------------------------------------------
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const folderId = searchParams.get("folderId");
  const supabase = await createClient();

  try {
    // 1. If folderId is provided, check access using Recursive CTE
    if (folderId) {
      console.log("folderId:.......................... YESSSSSSSSSS", folderId);
      const { data: accessCheck, error: accessError } = await supabase.rpc(
        "check_folder_starred",
        {
          user_id: userId,
          folder_id: folderId,
        }
      );
      console.log(" accessError:", accessError);
      console.log(" accessCheck:", accessCheck);

      if (accessError || !accessCheck) {
        return createResponse(403, null, "Access denied or folder not found.");
      }

      const { is_starred, is_shared } = accessCheck[0] || {};

      if (!is_starred) {
        return createResponse(403, null, "Folder is not starred.");
      }

      // 2. Fetch subfolders and files within the provided folderId
      const { data: folders, error: foldersError } = await supabase
        .from("folders")
        .select("*")
        .eq("parent_folder_id", folderId);

      const { data: files, error: filesError } = await supabase
        .from("files")
        .select("*")
        .eq("folder_id", folderId);

      if (foldersError || filesError) {
        throw new Error("Error fetching folders or files.");
      }

      if (is_shared) {
        folders.forEach((f) => (f.is_shared = true));
        files.forEach((f) => (f.is_shared = true));
      }

      return createResponse(
        200,
        { folders, files },
        null,
        "Folders and files fetched successfully."
      );
    } else {
      const { data: starredFolders, error: starredFoldersError } =
        await supabase
          .from("starred_items")
          .select("folder_id, is_shared, shared_by, folders(*)")
          .eq("starred_by", userId)
          .eq("item_type", "folder");

      const { data: sharedFiles, error: sharedFilesError } = await supabase
        .from("starred_items")
        .select("file_id, is_shared, shared_by, files(*)")
        .eq("starred_by", userId)
        .eq("item_type", "file");

      if (starredFoldersError || sharedFilesError) {
        throw new Error("Error fetching shared folders or files.");
      }

      const folders = starredFolders.map(
        ({ folders, is_shared, shared_by }) => ({
          ...folders,
          is_shared,
          shared_by,
        })
      );

      const files = sharedFiles.map(({ files, is_shared, shared_by }) => ({
        ...files,
        is_shared,
        shared_by,
      }));

      return createResponse(
        200,
        { folders, files },
        null,
        "Starred folders and files fetched successfully."
      );
    }
  } catch (error) {
    console.error("Failed to get starred content:", error);
    return createResponse(500, null, error.message, "Something went wrong.");
  }
}
