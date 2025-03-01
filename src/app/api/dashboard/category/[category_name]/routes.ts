import { createClient } from "@/middlewares/supabase/server";
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const category = searchParams.get("category_name");

  if (!userId) {
    return new Response(JSON.stringify({ message: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!category) {
    return new Response(JSON.stringify({ message: "Category is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
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

    if (filesError) throw filesError;

    return new Response(JSON.stringify({ files }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        message: "Error fetching files for the user",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
