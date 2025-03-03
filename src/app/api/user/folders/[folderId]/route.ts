import { createClient } from "@/middlewares/supabase/server";

const createResponse = (status, data = null, error = null, message = null) => {
  return new Response(JSON.stringify({ status, data, error, message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// PATCH : rename the folder ----------------------------------------------------------------------------------------------------
export async function PATCH(req) {
  try {
    const { itemId, userId, updateName, itemOwnerId, accessLevel } =
      await req.json();

    // Validate required fields
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

    // Fetch the current folder name before renaming
    const { data: currentFolder, error: fetchError } = await supabase
      .from("folders")
      .select("folder_name")
      .eq("id", itemId)
      .single();

    if (fetchError || !currentFolder) {
      console.error("Error fetching current folder:", fetchError);
      return createResponse(
        500,
        null,
        "Failed to fetch current folder details."
      );
    }

    const oldName = currentFolder.folder_name;

    // Rename the folder in the `folders` table
    const { data: renameData, error: renameError } = await supabase
      .from("folders")
      .update({ folder_name: updateName })
      .eq("id", itemId)
      .select()
      .single();

    if (renameError) {
      console.error("Supabase Error:", renameError);
      return createResponse(500, null, "Failed to rename folder.");
    }

    // Log the rename activity in the activities table
    const { error: activityError } = await supabase.from("activities").insert([
      {
        activity_type: "rename",
        item_type: "folder",
        file_id: null, // Ensure file_id is null for folder renames
        folder_id: itemId, // The ID of the renamed folder
        user_id: userId, // The user who renamed the folder
        details: { old_name: oldName, new_name: updateName }, // Store old and new names
      },
    ]);

    if (activityError) {
      console.error("Error logging rename activity:", activityError);
    }

    return createResponse(
      200,
      renameData,
      null,
      "Folder renamed successfully."
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return createResponse(
      500,
      null,
      error.message,
      "Error in renaming folder."
    );
  }
}

// DELETE : Delete a folder by id ----------------------------------------------------------------------------------------------------
export async function DELETE(req) {
  try {
    const { itemId, userId, accessLevel, itemOwnerId } = await req.json();

    // Check for required fields
    if (!itemId || !userId) {
      return createResponse(400, null, "Folder ID and User ID are required.");
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

    const { data: folderExists, error: folderCheckError } = await supabase
      .from("folders")
      .select("id")
      .eq("id", itemId)
      .single();

    if (folderCheckError && folderCheckError.code !== "PGRST116") {
      console.error("Folder check error:", folderCheckError);
      return createResponse(500, null, "Failed to check folder.");
    }

    if (!folderExists) {
      return createResponse(
        404,
        null,
        "Folder not found or you don't have permission to delete it."
      );
    }

    // Delete the folder from the folders table
    const { data: deleteData, error: deleteError } = await supabase
      .from("folders")
      .delete()
      .eq("id", itemId)

    if (deleteError) {
      console.error("Supabase Error:", deleteError);
      return createResponse(500, null, "Failed to delete folder.");
    }

    return createResponse(
      200,
      deleteData,
      null,
      "Folder deleted successfully."
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return createResponse(
      500,
      null,
      error.message,
      "Error in deleting folder."
    );
  }
}
