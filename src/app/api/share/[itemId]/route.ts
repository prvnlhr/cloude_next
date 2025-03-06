import { createClient } from "@/middlewares/supabase/server";
import { createResponse } from "@/utils/apiResponseUtils";

// -------------------------------------------
export async function DELETE(req: Request) {
  try {
    const { userId, itemId, itemType } = await req.json();

    if (!itemId || !userId || !itemType) {
      return createResponse(400, null, "All fields are required.");
    }

    const supabase = await createClient();

    // Find all users who received access from userId for this item
    const { data: sharedUsers, error: fetchError } = await supabase
      .from("share_items")
      .select("id, shared_with")
      .eq("shared_by", userId)
      .eq(itemType === "file" ? "file_id" : "folder_id", itemId);

    if (fetchError) {
      console.error("Error fetching shared users:", fetchError);
      return createResponse(500, null, "Failed to fetch shared users.");
    }

    // Recursively delete all shares from the users who were shared by userId
    if (sharedUsers.length > 0) {
      const sharedWithIds = sharedUsers.map((row) => row.shared_with);

      const { error: recursiveDeleteError } = await supabase
        .from("share_items")
        .delete()
        .in("shared_by", sharedWithIds)
        .eq(itemType === "file" ? "file_id" : "folder_id", itemId);

      if (recursiveDeleteError) {
        console.error("Error removing indirect shares:", recursiveDeleteError);
        return createResponse(500, null, "Failed to remove indirect shares.");
      }
    }

    // Delete the original shared item
    const { error: deleteError } = await supabase
      .from("share_items")
      .delete()
      .eq(itemType === "file" ? "file_id" : "folder_id", itemId)
      .eq("shared_by", userId);

    if (deleteError) {
      console.error("Error removing shared item:", deleteError);
      return createResponse(500, null, "Failed to remove item from shared.");
    }

    return createResponse(
      200,
      { itemId, userId },
      null,
      "Item removed from shared successfully, including indirect shares."
    );
  } catch (error) {
    console.error("Error in share item DELETE route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createResponse(
      500,
      null,
      errorMessage,
      "An unexpected error occurred."
    );
  }
}

// GET : get a item which is shared with user ----------------------------------------------------------------------------------------
export async function GET(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    console.log(" userId:", userId);
    console.log(" itemId:", itemId);

    if (!itemId || !userId) {
      return createResponse(400, null, "itemId and userId are required.");
    }

    const supabase = await createClient();

    // Fetch the shared file with matching itemId and userId
    const { data: sharedFiles, error: sharedFilesError } = await supabase
      .from("share_items")
      .select("file_id, files(*)")
      .eq("shared_with", userId)
      .eq("item_type", "file")
      .eq("file_id", itemId)
      .maybeSingle();

    if (sharedFilesError) {
      console.error("Supabase Error:", sharedFilesError);
      return createResponse(500, null, "Failed to fetch shared file.");
    }

    if (!sharedFiles) {
      return createResponse(200, {}, null, "Shared file not found.");
    }

    return createResponse(
      200,
      { ...sharedFiles.files },
      null,
      "Shared file fetched successfully."
    );
  } catch (error) {
    console.error("GET Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(
      500,
      null,
      errorMessage,
      "Error in fetching shared file."
    );
  }
}
