import { createClient } from "@/middlewares/supabase/server";

const createResponse = (status, data = null, error = null, message = null) => {
  return new Response(JSON.stringify({ status, data, error, message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// DELETE : delete a item(unshare) to user -------------------------------------------------------------------------------------------
export async function DELETE(req) {
  try {
    const { userId, itemId, itemType } = await req.json();

    if (!itemId || !userId || !itemType) {
      return createResponse(400, null, "All fields are required.");
    }

    const supabase = await createClient();

    // Delete the shared item
    const { data: deleteData, error: deleteError } = await supabase
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
      "Item removed from shared successfully."
    );
  } catch (error) {
    console.error("Error in share item DELETE route:", error);
    return createResponse(
      500,
      null,
      error.message,
      "An unexpected error occurred."
    );
  }
}

// GET : get a item which is shared with user ----------------------------------------------------------------------------------------
export async function GET(req, { params }) {
  try {
    const { itemId } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

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
      .single();

    if (sharedFilesError) {
      console.error("Supabase Error:", sharedFilesError);
      return createResponse(500, null, "Failed to fetch shared file.");
    }

    if (!sharedFiles) {
      return createResponse(404, null, "Shared file not found.");
    }

    return createResponse(
      200,
      { file: sharedFiles.files },
      null,
      "Shared file fetched successfully."
    );
  } catch (error) {
    console.error("GET Error:", error);
    return createResponse(
      500,
      null,
      error.message,
      "Error in fetching shared file."
    );
  }
}
