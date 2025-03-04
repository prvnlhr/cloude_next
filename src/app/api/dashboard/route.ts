import { createClient } from "@/middlewares/supabase/server";

import { createResponse } from "@/utils/apiResponseUtils";

export interface RecentActivity {
  id: string;
  activity_type: "upload" | "rename" | "delete" | "move" | "star" | "share";
  item_type: "file" | "folder";
  activity_timestamp: string;
  details: {
    shared_with?: string;
    shared_with_name?: string;
    new_name?: string;
    old_name?: string;
  } | null;
  file_id: string | null;
  folder_id: string | null;
  files?: {
    id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    storage_path: string;
    thumbnail_url: string | null;
  } | null;
  folders?: {
    id: string;
    folder_name: string;
    path: string;
  } | null;
}

// GET : dashboard content -> recent uploaded files, folder categories, activities -------------------------------------------------------
export async function GET(req: Request) {
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

    // const transformedActivities = recentActivities.map((activity) => {
    //   const isFile = activity.item_type === "file";
    //   const isFolder = activity.item_type === "folder";

    //   return {
    //     id: activity.id,
    //     activity_type: activity.activity_type,
    //     item_type: activity.item_type,
    //     item_name: isFile
    //       ? activity.files?.file_name
    //       : activity.folders?.folder_name,
    //     item_path: isFile
    //       ? activity.files?.storage_path
    //       : activity.folders?.path,
    //     details: activity.details,
    //     timestamp: activity.activity_timestamp,
    //     file_id: isFile ? activity.file_id : null,
    //     folder_id: isFolder ? activity.folder_id : null,
    //   };
    // });
    // console.log(" recentActivities:", recentActivities);
    // console.log("transformedActivities", transformedActivities);

    const dashboardContent = {
      recentUploads,
      filesByExtensions,
      recentActivities,
    };
    return createResponse(
      200,
      dashboardContent,
      null,
      "Dashboard content fetched successfully."
    );
  } catch (error) {
    console.error("GET Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createResponse(
      500,
      null,
      errorMessage,
      "Error in fetching dashboard content."
    );
  }
}
