import { createClient } from "@/middlewares/supabase/server";

export async function PATCH(req) {
  try {
    const { itemId, userId, updateName } = await req.json();

    if (!itemId || !updateName || !userId) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = await createClient();

    const { data: renameData, error: renameError } = await supabase
      .from("files")
      .update({ file_name: updateName })
      .eq("id", itemId)
      .eq("user_id", userId);

    if (renameError) {
      console.error("Supabase Error:", renameError);
      return new Response(JSON.stringify({ error: "Failed to rename file" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ renameData }), {
      status: 200, // 200 OK for successful updates
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("PATCH Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal Server Error",
        message: "Error in renaming file",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(req) {
  try {
    const { itemId, userId } = await req.json();

    // Check for required fields
    if (!itemId || !userId) {
      return new Response(
        JSON.stringify({ error: "Item ID and User ID are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = await createClient();

    // Delete the item from the files table
    const { data: deleteData, error: deleteError } = await supabase
      .from("files")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId);

    // Handle Supabase error
    if (deleteError) {
      console.error("Supabase Error:", deleteError);
      return new Response(JSON.stringify({ error: "Failed to delete file." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ deleteData }), {
      status: 200, // 200 OK for successful deletion
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal Server Error",
        message: "Error in deleting file.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
