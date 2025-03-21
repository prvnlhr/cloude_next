import { createClient } from "@/middlewares/supabase/server";
import { createResponse } from "@/utils/apiResponseUtils";

// PATCH : rename a file with id ------------------------------------------------------------------------------------------------------------------
export async function PATCH(req: Request) {
  try {
    const { itemId, userId, updateName, itemOwnerId, accessLevel } =
      await req.json();

    if (!itemId || !updateName || !userId) {
      return createResponse(400, null, "All fields are required.");
    }

    const isShared = itemOwnerId !== userId;
    const isAllowed = accessLevel === "FULL" || accessLevel === "WRITE";

    if (isShared && !isAllowed) {
      return createResponse(
        403,
        null,
        "Insufficient permissions to rename file."
      );
    }

    const supabase = await createClient();

    // Fetch the current file name before renaming
    const { data: currentFile, error: fetchError } = await supabase
      .from("files")
      .select("file_name")
      .eq("id", itemId)
      .single();

    if (fetchError || !currentFile) {
      console.error("Error fetching current file:", fetchError);
      return createResponse(500, null, "Failed to fetch current file details.");
    }

    const oldName = currentFile.file_name;

    // Rename the file in the `files` table
    const { data: renameData, error: renameError } = await supabase
      .from("files")
      .update({ file_name: updateName })
      .eq("id", itemId)
      .select()
      .single();

    if (renameError) {
      console.error("Supabase Error:", renameError);
      return createResponse(500, null, "Failed to rename file.");
    }

    // Log the rename activity in the activities table
    const { error: activityError } = await supabase.from("activities").insert([
      {
        activity_type: "rename",
        item_type: "file",
        file_id: itemId,
        folder_id: null,
        user_id: userId,
        details: { old_name: oldName, new_name: updateName },
      },
    ]);

    if (activityError) {
      console.error("Error logging rename activity:", activityError);
    }

    return createResponse(200, renameData, null, "File renamed successfully.");
  } catch (error) {
    console.error("PATCH Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(500, null, errorMessage, "Error in renaming file.");
  }
}

// DELETE : delete a file with id ------------------------------------------------------------------------------------------------------------------
export async function DELETE(req: Request) {
  try {
    const { itemId, userId, accessLevel, itemOwnerId } = await req.json();

    if (!itemId || !userId) {
      return createResponse(400, null, "Item ID and User ID are required.");
    }

    const isShared = itemOwnerId !== userId;
    const isAllowed = accessLevel === "FULL";

    if (isShared && !isAllowed) {
      return createResponse(
        403,
        null,
        "You do not have permission to delete this shared file."
      );
    }

    const supabase = await createClient();

    const { data: fileExists, error: fileCheckError } = await supabase
      .from("files")
      .select("id, storage_path")
      .eq("id", itemId)
      .single();

    if (fileCheckError && fileCheckError.code !== "PGRST116") {
      console.error("File check error:", fileCheckError);
      return createResponse(500, null, "Failed to verify file ownership.");
    }

    if (!fileExists) {
      return createResponse(
        404,
        null,
        "File not found or you don't have permission to delete it."
      );
    }

    const { error: storageError } = await supabase.storage
      .from("cloude")
      .remove([fileExists.storage_path]);

    if (storageError) {
      console.error("Storage Deletion Error:", storageError);
      return createResponse(500, null, "Failed to delete file from storage.");
    }

    // Delete the item from the files table
    const { data: deleteData, error: deleteError } = await supabase
      .from("files")
      .delete()
      .eq("id", itemId);

    if (deleteError) {
      console.error("Supabase Error:", deleteError);
      return createResponse(500, null, "Failed to delete file.");
    }

    return createResponse(200, deleteData, null, "File deleted successfully.");
  } catch (error) {
    console.error("DELETE Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(500, null, errorMessage, "Error in deleting file.");
  }
}

// GET : get a file with id ------------------------------------------------------------------------------------------------------------------
export async function GET(
  req: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!fileId || !userId) {
      return createResponse(400, null, "fileId and userId are required.");
    }

    const supabase = await createClient();

    // Fetch the file with matching fileId and userId
    const { data: file, error: fetchError } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) {
      console.error("Supabase Error:", fetchError);
      return createResponse(500, null, "Failed to fetch file.");
    }

    if (!file) {
      return createResponse(404, null, "File not found.");
    }

    return createResponse(200, file, null, "File fetched successfully.");
  } catch (error) {
    console.error("GET Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(500, null, errorMessage, "Error in fetching file.");
  }
}
