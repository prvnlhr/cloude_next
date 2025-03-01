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

    const { data: recentActivities, error: activitiesError } = await supabase
      .from("activities")
      .select(
        `
        id, activity_type, item_type, activity_timestamp, details,
         file_id, folder_id,
        files:file_id (id, file_name, file_type, file_size, storage_path, thumbnail_url),
        folders:folder_id (id, folder_name, path)
      `
      )
      .eq("user_id", userId)
      .order("activity_timestamp", { ascending: false });

    if (activitiesError) throw activitiesError;

    // Transform activities to include item details
    const transformedActivities = recentActivities.map((activity) => {
      const isFile = activity.item_type === "file";
      const isFolder = activity.item_type === "folder";

      return {
        id: activity.id,
        activity_type: activity.activity_type,
        item_type: activity.item_type,
        item_name: isFile
          ? activity.files?.file_name
          : activity.folders?.folder_name,
        item_path: isFile
          ? activity.files?.storage_path
          : activity.folders?.path,
        performed_by: activity.users?.email || "Unknown",
        details: activity.details,
        timestamp: activity.activity_timestamp,
        file_id: isFile ? activity.file_id : null, // Include file_id only for files
        folder_id: isFolder ? activity.folder_id : null, // Include folder_id only for folders
      };
    });

    return new Response(
      JSON.stringify({
        recentUploads,
        filesByExtensions,
        recentActivities: transformedActivities,
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
