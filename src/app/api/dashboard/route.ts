import { createClient } from "@/middlewares/supabase/server";
import { DashboardContent } from "../../../types/dashboardTypes";

const createResponse = (
  status: number,
  data: any = null,
  error: string | null = null,
  message: string | null = null
) => {
  return new Response(JSON.stringify({ status, data, error, message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// GET : dashboard content -> recent uploaded files, folder categories, activities -------------------------------------------------------
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return createResponse(400, null, "User ID is required.");
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

    if (recentUploadsError) {
      throw new Error(
        "Failed to fetch recent uploads: " + recentUploadsError.message
      );
    }

    // 2. Fetch all file categories uploaded by the user
    const { data: allFiles, error: allFilesError } = await supabase
      .from("files")
      .select("id, file_name, file_type, created_at")
      .eq("user_id", userId);

    if (allFilesError) {
      throw new Error("Failed to fetch all files: " + allFilesError.message);
    }

    // Extract unique file extensions
    const filesByExtensions = [
      ...new Set(
        allFiles
          .map((file) => file.file_name.split(".").pop()?.toLowerCase())
          .filter(Boolean)
      ),
    ];

    // 3. Fetch recent activities
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

    if (activitiesError) {
      throw new Error(
        "Failed to fetch recent activities: " + activitiesError.message
      );
    }

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
        file_id: isFile ? activity.file_id : null,
        folder_id: isFolder ? activity.folder_id : null,
      };
    });

    const dashboardContent: DashboardContent = {
      recentUploads,
      filesByExtensions,
      recentActivities: transformedActivities,
    };
    return createResponse(
      200,
      dashboardContent,
      null,
      "Dashboard content fetched successfully."
    );
  } catch (error) {
    console.error("GET Error:", error);
    return createResponse(
      500,
      null,
      error.message,
      "Error in fetching dashboard content."
    );
  }
}
