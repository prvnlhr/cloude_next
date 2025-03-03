import { createClient } from "@/middlewares/supabase/server";

const createResponse = (status, data = null, error = null, message = null) => {
  return new Response(JSON.stringify({ status, data, error, message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// -> NOT IN USE
// GET : all items for a particular category -----------------------------------------------------------------------------------------
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const category = searchParams.get("category_name");

  if (!userId || !category) {
    return createResponse(400, null, "User ID and category are required.");
  }

  const supabase = await createClient();

  try {
    // Fetch all files that match the userId and file_type (category)
    const { data: files, error: filesError } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", userId)
      .eq("file_type", category)
      .order("created_at", { ascending: false });

    if (filesError) {
      throw new Error("Failed to fetch files: " + filesError.message);
    }

    return createResponse(200, { files }, null, "Files fetched successfully.");
  } catch (error) {
    console.error("GET Error:", error);
    return createResponse(
      500,
      null,
      error.message,
      "Error fetching files for the user."
    );
  }
}
