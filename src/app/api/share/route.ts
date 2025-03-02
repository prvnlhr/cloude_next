import { createClient } from "@/middlewares/supabase/server";

const createResponse = (status, data = null, error = null, message = null) => {
  return new Response(JSON.stringify({ status, data, error, message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// POST : share a item(file or folder with other user) -----------------------------------------------------------------------------------------------

export async function POST(req) {
  try {
    const supabase = await createClient();

    const { itemId, itemType, sharedById, shareWithEmail } = await req.json();

    // Validate required fields
    if (!itemId || !itemType || !sharedById || !shareWithEmail) {
      return createResponse(400, null, "All fields are required.");
    }

    // Get the userId of the person to share with
    const { data: shareWithUser, error: shareWithError } = await supabase
      .from("users")
      .select("user_id, full_name")
      .eq("email", shareWithEmail)
      .single();

    if (shareWithError || !shareWithUser) {
      console.error("Error fetching user details:", shareWithError);
      return createResponse(
        shareWithUser ? 500 : 404,
        null,
        shareWithUser
          ? "Failed to fetch user details."
          : "User with this email does not exist."
      );
    }

    const shareWithUserId = shareWithUser.user_id;
    const shareWithUserName = shareWithUser.full_name;

    // Check if the item is already shared with the user
    const { data: existingShare, error: checkError } = await supabase
      .from("share_items")
      .select("id")
      .eq(itemType === "file" ? "file_id" : "folder_id", itemId)
      .eq("item_type", itemType)
      .eq("shared_with", shareWithUserId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing share:", checkError);
      return createResponse(500, null, "Error checking existing share.");
    }

    if (existingShare) {
      return createResponse(
        409,
        null,
        "Item is already shared with this user."
      );
    }

    // Insert into share_items table
    const insertData = {
      item_type: itemType,
      shared_by: sharedById,
      shared_with: shareWithUserId,
      file_id: itemType === "file" ? itemId : null,
      folder_id: itemType === "folder" ? itemId : null,
    };

    const { data: sharedItem, error: insertError } = await supabase
      .from("share_items")
      .insert([insertData])
      .single();

    if (insertError) {
      console.error("Error sharing item:", insertError);
      return createResponse(500, null, "Failed to share item.");
    }

    // Log the share activity in the activities table
    const { error: activityError } = await supabase.from("activities").insert([
      {
        activity_type: "share",
        item_type: itemType,
        file_id: itemType === "file" ? itemId : null,
        folder_id: itemType === "folder" ? itemId : null,
        user_id: sharedById,
        details: {
          shared_with: shareWithUserId,
          shared_with_name: shareWithUserName,
        },
      },
    ]);

    if (activityError) {
      console.error("Error logging share activity:", activityError);
    }

    return createResponse(200, sharedItem, null, "Item shared successfully.");
  } catch (error) {
    console.error("Error at Share file POST:", error);
    return createResponse(
      500,
      null,
      error.message,
      "Error at Share file POST."
    );
  }
}

// Helper functions
async function getSharedWithMeData(userId, folderId) {
  const supabase = await createClient();

  if (folderId) {
    // Check folder access
    const { data: accessibleFolders, error: accessError } = await supabase.rpc(
      "check_folder_access",
      {
        user_id: userId,
        folder_id: folderId,
      }
    );

    if (accessError || !accessibleFolders) {
      throw new Error("Access denied or folder not found.");
    }

    // Fetch subfolders and files within the provided folderId
    const { data: folders, error: foldersError } = await supabase
      .from("folders")
      .select("*")
      .eq("parent_folder_id", folderId);

    const { data: files, error: filesError } = await supabase
      .from("files")
      .select("*")
      .eq("folder_id", folderId);

    if (foldersError || filesError) {
      throw new Error("Error fetching folders or files.");
    }

    return { folders, files };
  } else {
    // Fetch shared items at the root level
    const { data: sharedFolders, error: sharedFoldersError } = await supabase
      .from("share_items")
      .select("folder_id, folders(*)")
      .eq("shared_with", userId)
      .eq("item_type", "folder");

    const { data: sharedFiles, error: sharedFilesError } = await supabase
      .from("share_items")
      .select("file_id, files(*)")
      .eq("shared_with", userId)
      .eq("item_type", "file");

    if (sharedFoldersError || sharedFilesError) {
      throw new Error("Error fetching shared folders or files.");
    }

    // Extract folders and files from the join result
    const folders = sharedFolders.map((item) => item.folders);
    const files = sharedFiles.map((item) => item.files);

    return { folders, files };
  }
}
async function getSharedByMeData(userId, folderId) {
  const supabase = await createClient();

  let query = supabase
    .from("share_items")
    .select("folder_id, folders(*), file_id, files(*)")
    .eq("shared_by", userId);

  // Filter by folderId if provided
  if (folderId) {
    query = query.eq("folders.parent_folder_id", folderId);
  }

  const { data: sharedItems, error } = await query;

  if (error) {
    throw new Error("Error fetching shared items by the user.");
  }

  // Extract folders and files from the result
  const folders = sharedItems
    .filter((item) => item.folders)
    .map((item) => item.folders);
  const files = sharedItems
    .filter((item) => item.files)
    .map((item) => item.files);

  return { folders, files };
}

//  GET : get all the share content of a user ------------------------------------------------------------------------------
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const folderId = searchParams.get("folderId");
  const shareByMe = searchParams.get("shareByMe");

  try {
    let folders, files;

    if (shareByMe) {
      // Fetch data shared by the user
      ({ folders, files } = await getSharedByMeData(userId, folderId));
    } else {
      // Fetch data shared with the user
      ({ folders, files } = await getSharedWithMeData(userId, folderId));
    }

    return createResponse(
      200,
      { folders, files },
      null,
      "Shared content fetched successfully."
    );
  } catch (error) {
    console.error("Failed to get shared content:", error);
    return createResponse(
      500,
      null,
      error.message,
      "Failed to get shared content."
    );
  }
}
