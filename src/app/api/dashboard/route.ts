import { createClient } from "@/middlewares/supabase/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ message: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = await createClient();

  try {
    // 1. Fetch 10 recent uploads by the user
    const { data: recentUploads, error: recentUploadsError } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (recentUploadsError) throw recentUploadsError;

    // 2. Fetch all file categories uploaded by the user
    const { data: allFiles, error: allFilesError } = await supabase
      .from("files")
      .select("id, file_name, file_type, created_at")
      .eq("user_id", userId);

    if (allFilesError) throw allFilesError;

    // 2. Extract unique file extensions
    const filesByExtensions = [
      ...new Set(
        allFiles
          .map((file) => file.file_name.split(".").pop()?.toLowerCase())
          .filter(Boolean)
      ),
    ];

    // 3. Fetch 20 most recent shared files (shared by or received by the user)
    const { data: sharedFiles, error: sharedFilesError } = await supabase
      .from("share_items")
      .select(
        `
        id, item_type, share_timestamp, shared_by, shared_with, 
        files(file_name, file_size, file_type, created_at), 
        folders(folder_name, created_at), 
        shared_by_user:users!shared_by(full_name), 
        shared_with_user:users!shared_with(full_name)
      `
      )
      .or(`shared_by.eq.${userId},shared_with.eq.${userId}`)
      .order("share_timestamp", { ascending: false })
      .limit(20);

    if (sharedFilesError) throw sharedFilesError;

    return new Response(
      JSON.stringify({
        recentUploads,
        filesByExtensions,
        sharedFiles,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        message: "Error in fetching dashboard content",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
