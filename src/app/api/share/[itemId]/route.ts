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

export async function GET(req, { params }) {
  try {
    const { itemId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log(" itemId--------------xxxxxx:", itemId);
    console.log(" userId--------------xxxxxx:", userId);

    // Validate required fields
    if (!itemId || !userId) {
      return new Response(
        JSON.stringify({ error: "itemId and userId are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = await createClient();

    // Fetch the file with matching itemId and userId
    const { data: sharedFiles, error: sharedFilesError } = await supabase
      .from("share_items")
      .select("file_id, files(*)")
      .eq("shared_with", userId)
      .eq("item_type", "file")
      .single();

    if (sharedFilesError) {
      console.error("Supabase Error:", sharedFilesError);
      return new Response(JSON.stringify({ error: "Failed to fetch file" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!sharedFiles) {
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(" sharedFiles:", sharedFiles);
    // Return the fetched file
    return new Response(JSON.stringify({ file: sharedFiles.files }), {
      status: 200,
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

// export async function GET(req, { params }) {
//   try {
//     const { fileId } = await params;
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     console.log(" fileId--------------:", fileId);
//     console.log(" userId--------------:", userId);

//     // Validate required fields
//     if (!fileId || !userId) {
//       return new Response(
//         JSON.stringify({ error: "fileId and userId are required." }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     const supabase = await createClient();

//     // Fetch the file with matching fileId and userId
//     const { data: file, error: fetchError } = await supabase
//       .from("files")
//       .select("*")
//       .eq("id", fileId)
//       .eq("user_id", userId)
//       .maybeSingle();

//     if (fetchError) {
//       console.error("Supabase Error:", fetchError);
//       return new Response(JSON.stringify({ error: "Failed to fetch file" }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     if (!file) {
//       return new Response(JSON.stringify({ error: "File not found" }), {
//         status: 404,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // Return the fetched file
//     return new Response(JSON.stringify({ file }), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("GET Error:", error);
//     return new Response(
//       JSON.stringify({
//         error: error.message || "Internal Server Error",
//         message: "Error in fetching file",
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }
