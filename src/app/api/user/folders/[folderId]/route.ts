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
      .from("folders")
      .update({ folder_name: updateName })
      .eq("id", itemId)
      .eq("user_id", userId);

    if (renameError) {
      console.error("Supabase Error:", renameError);
      return new Response(
        JSON.stringify({ error: "Failed to rename folder" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
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
        message: "Error in renaming folder",
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
        JSON.stringify({ error: "Folder ID and User ID are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = await createClient();

    const { data: folderExists, error: folderCheckError } = await supabase
      .from("folders")
      .select("id")
      .eq("id", itemId)
      .eq("user_id", userId)
      .single();

    if (folderCheckError && folderCheckError.code !== "PGRST116") {
      console.error("Folder check error:", folderCheckError);
      return Response.json(
        {
          error: "Failed to check folder",
          details: folderCheckError.message,
        },
        { status: 500 }
      );
    }

    if (!folderExists) {
      return Response.json(
        { error: "Folder not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete the folder from the folders table
    const { data: deleteData, error: deleteError } = await supabase
      .from("folders")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId);

    // Handle Supabase error
    if (deleteError) {
      console.error("Supabase Error:", deleteError);
      return new Response(
        JSON.stringify({ error: "Failed to delete folder." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
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
        message: "Error in deleting folder.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
