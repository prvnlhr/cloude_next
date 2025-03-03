import { createClient } from "@/middlewares/supabase/server";

const createResponse = (status, data = null, error = null, message = null) => {
  return new Response(JSON.stringify({ status, data, error, message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

//  DELETE : remove item from starred -------------------------------------------------------------------------------------
export async function DELETE(req) {
  try {
    const { itemId, itemType, userId, itemOwnerId } = await req.json();
    if (!itemId || !itemType || !userId || !itemOwnerId) {
      return createResponse(400, null, "All fields are required.");
    }

    const supabase = await createClient();

    // Check if the item is already starred
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

    if (!existingStar) {
      return createResponse(404, null, "Item is not starred.");
    }

    // Delete the item from starred_items
    const { error: deleteError } = await supabase
      .from("starred_items")
      .delete()
      .eq("id", existingStar.id);

    if (deleteError) {
      console.error("Error deleting starred item:", deleteError);
      return createResponse(500, null, "Failed to remove item from starred.");
    }

    // Update is_starred to false in the respective table (files or folders)
    const updateTable = itemType === "file" ? "files" : "folders";
    const { error: updateError } = await supabase
      .from(updateTable)
      .update({ is_starred: false })
      .eq("id", itemId);

    if (updateError) {
      console.error("Error updating is_starred in table:", updateError);
      return createResponse(
        500,
        null,
        "Failed to update is_starred in the respective table."
      );
    }

    // Return success response
    return createResponse(
      200,
      { itemId, itemType, userId },
      null,
      "Item removed from starred successfully."
    );
  } catch (error) {
    console.error("Error in DELETE route:", error);
    return createResponse(
      500,
      null,
      error.message,
      "An unexpected error occurred."
    );
  }
}
