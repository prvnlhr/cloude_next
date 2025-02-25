import { createClient } from "@/middlewares/supabase/server";

export async function POST(req) {
  try {
    const supabase = await createClient();

    const { itemId, itemType, userId } = await req.json();
    if (!itemId || !itemType || !userId) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
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
      return new Response(
        JSON.stringify({
          error: "Error checking existing star.",
          details: checkError.message,
        }),
        { status: 500 }
      );
    }

    if (existingStar) {
      return new Response(
        JSON.stringify({ message: "Item is already added to Starred." }),
        { status: 409 }
      );
    }

    const insertData = {
      starred_by: userId,
      item_type: itemType,
      file_id: itemType === "file" ? itemId : null,
      folder_id: itemType === "folder" ? itemId : null,
    };

    // Insert the starred item
    const { data: starredItem, error: insertError } = await supabase
      .from("starred_items")
      .insert([insertData])
      .single();

    if (insertError) {
      console.error("Error inserting starred item:", insertError);
      return new Response(
        JSON.stringify({
          error: "Failed to mark item as starred.",
          details: insertError.message,
        }),
        { status: 500 }
      );
    }

    const updateTable = itemType === "file" ? "files" : "folders";

    const { error: updateError } = await supabase
      .from(updateTable)
      .update({ is_starred: true })
      .eq("id", itemId);

    if (updateError) {
      console.error("Error updating is_starred in table:", updateError);
      return new Response(
        JSON.stringify({
          error: "Failed to update is_starred in the respective table.",
          details: updateError.message,
        }),
        { status: 500 }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Item added to Starred successfully.",
        starredItem,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error at Star file POST:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        message:
          "An unexpected error occurred while marking the item as starred.",
      }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const folderId = searchParams.get("folderId");
  const supabase = await createClient();
  console.log("userId:", userId);
  console.log("folderId:", folderId);

  try {
    // 1. If folderId is provided, check access using Recursive CTE
    if (folderId) {
      const { data: accessibleFolders, error: accessError } =
        await supabase.rpc("check_folder_starred", {
          user_id: userId,
          folder_id: folderId,
        });

      if (accessError || !accessibleFolders) {
        return new Response(
          JSON.stringify({ error: "Access denied or folder not found." }),
          { status: 403 }
        );
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

      return new Response(
        JSON.stringify({
          folders,
          files,
        }),
        {
          status: 200,
        }
      );
    } else {
      // 3. If folderId is null, we're at the root level. Fetch only shared items at the root level
      const { data: starredFolders, error: starredFoldersError } =
        await supabase
          .from("starred_items")
          .select("folder_id, folders(*)")
          .eq("starred_by", userId)
          .eq("item_type", "folder");

      // console.log("starredFolders:", starredFolders);
      // console.log("starredFoldersError:", starredFoldersError);

      const { data: sharedFiles, error: sharedFilesError } = await supabase
        .from("starred_items")
        .select("file_id, files(*)")
        .eq("starred_by", userId)
        .eq("item_type", "file");

      if (starredFoldersError || sharedFilesError) {
        throw new Error("Error fetching shared folders or files.");
      }

      // Extract the folders and files from the join result
      const folders = starredFolders.map((item) => item.folders);
      const files = sharedFiles.map((item) => item.files);

      return new Response(JSON.stringify({ folders, files }), {
        status: 200,
      });
    }
  } catch (error) {
    console.error("Failed to get starred content:", error);
    return new Response(
      JSON.stringify({
        error: "Something went wrong.",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
