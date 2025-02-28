import { createClient } from "@/middlewares/supabase/server";

export async function DELETE(req) {
  const { userId, itemId, itemType } = await req.json();

  console.log(" itemId:", itemId);
  console.log(" userId:", userId);
  console.log(" itemType:", itemType);

  try {
    const supabase = await createClient();
    if (!itemId || !userId) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: deleteData, deleteError } = await supabase
      .from("share_items")
      .delete()
      .eq(itemType === "file" ? "file_id" : "folder_id", itemId)
      .eq("shared_by", userId);

    if (deleteError) {
      console.error("Error removing shared item:", deleteError);
      return new Response(
        JSON.stringify({
          error: "Failed to remove item from starred.",
          details: deleteError.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Item removed from shared successfully.",
        itemId,
        userId,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in share item DELETE route:", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred.",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
