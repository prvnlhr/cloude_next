import { createClient } from "@/middlewares/supabase/server";

export async function DELETE(req: Request) {
  const { itemType, userId, itemId } = await req.json();


  try {
    const supabase = await createClient();

    if (!itemId || !itemType || !userId) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!existingStar) {
      return new Response(JSON.stringify({ error: "Item is not starred." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Delete the item from starred_items
    const { error: deleteError } = await supabase
      .from("starred_items")
      .delete()
      .eq("id", existingStar.id);

    if (deleteError) {
      console.error("Error deleting starred item:", deleteError);
      return new Response(
        JSON.stringify({
          error: "Failed to remove item from starred.",
          details: deleteError.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update is_starred to false in the respective table (files or folders)
    const updateTable = itemType === "file" ? "files" : "folders";
    const { error: updateError } = await supabase
      .from(updateTable)
      .update({ is_starred: false })
      .eq("id", itemId);

    if (updateError) {
      console.error("Error updating is_starred in table:", updateError);
      return new Response(
        JSON.stringify({
          error: "Failed to update is_starred in the respective table.",
          details: updateError.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Item removed from starred successfully.",
        itemId,
        itemType,
        userId,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in DELETE route:", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred.",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
