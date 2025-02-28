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

    const { data: fileExists, error: fileCheckError } = await supabase
      .from("files")
      .select("id, storage_path")
      .eq("id", itemId)
      .eq("user_id", userId)
      .single();

    if (fileCheckError && fileCheckError.code !== "PGRST116") {
      console.error("File check error:", fileCheckError);
      return Response.json(
        {
          error: "Failed to verify file ownership",
          details: fileCheckError.message,
        },
        { status: 500 }
      );
    }

    if (!fileExists) {
      return Response.json(
        { error: "File not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }
    console.log(fileExists.storage_path);

    const { data: storageData, error: storageError } = await supabase.storage
      .from("cloude")
      .remove([fileExists.storage_path]);

    if (storageError) {
      console.error("Storage Deletion Error:", storageError);
      return new Response(
        JSON.stringify({
          error: "Failed to delete file from storage",
          details: storageError.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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

export async function GET(req, { params }) {
  try {
    const { fileId } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log(userId, fileId);

    // Validate required fields
    if (!fileId || !userId) {
      return new Response(
        JSON.stringify({ error: "fileId and userId are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = await createClient();

    // Fetch the file with matching fileId and userId
    const { data: file, error: fetchError } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      console.error("Supabase Error:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch file" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the fetched file
    return new Response(JSON.stringify({ file }), {
      status: 200, // 200 OK for successful fetch
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("GET Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal Server Error",
        message: "Error in fetching file",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
