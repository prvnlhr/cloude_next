import { createClient } from "@/middlewares/supabase/server";

export async function POST(req) {
  try {
    const supabase = await createClient();

    const { itemId, itemType, sharedById, shareWithEmail } = await req.json();
    console.log(" shareWithEmail:", shareWithEmail);
    console.log(" sharedById:", sharedById);
    console.log(" itemType:", itemType);
    console.log(" itemId:", itemId);

    // Validate required fields
    if (!itemId || !itemType || !sharedById || !shareWithEmail) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }

    // Get the userId of the person to share with
    const { data: shareWithUser, error: shareWithError } = await supabase
      .from("users")
      .select("user_id, full_name")
      .eq("email", shareWithEmail)
      .single();

    if (shareWithError || !shareWithUser) {
      console.log("shareWithError->", shareWithError);

      // If no user is found, return a 404 response
      if (!shareWithUser) {
        return new Response(
          JSON.stringify({
            error: "User with this email does not exist.",
          }),
          { status: 404 }
        );
      }

      // If there's a Supabase error, return a 500 response
      return new Response(
        JSON.stringify({
          error: shareWithError.message || "Failed to fetch user details.",
        }),
        { status: 500 }
      );
    }

    const shareWithUserId = shareWithUser.user_id;
    const shareWithUserName = shareWithUser.full_name;

    const { data: existingShare, error: checkError } = await supabase
      .from("share_items")
      .select("id")
      .eq(itemType === "file" ? "file_id" : "folder_id", itemId)
      .eq("item_type", itemType)
      .eq("shared_with", shareWithUserId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing share:", checkError);
      return new Response(
        JSON.stringify({ error: "Error checking existing share." }),
        { status: 500 }
      );
    }

    if (existingShare) {
      return new Response(
        JSON.stringify({ message: "Item is already shared with this user." }),
        { status: 409 }
      );
    }

    const insertData = {
      item_type: itemType,
      shared_by: sharedById,
      shared_with: shareWithUserId,
      file_id: itemType === "file" ? itemId : null,
      folder_id: itemType === "folder" ? itemId : null,
    };

    // Insert into share_items table
    const { data: sharedItem, error: insertError } = await supabase
      .from("share_items")
      .insert([insertData])
      .single();

    if (insertError) {
      console.error("Error sharing item:", insertError);
      return new Response(JSON.stringify({ error: "Failed to share item." }), {
        status: 500,
      });
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

    return new Response(
      JSON.stringify({
        message: "Item shared successfully.",
        sharedItem,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error at Share file POST:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        message: "Error at Share file POST",
      }),
      { status: 500 }
    );
  }
}

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

    return new Response(JSON.stringify({ folders, files }), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to get shared content:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Something went wrong.",
      }),
      { status: 500 }
    );
  }
}

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId");
//   const folderId = searchParams.get("folderId");

//   const supabase = await createClient();

//   try {
//     // If a specific folder is opened

//     if (folderId) {
//       // Get child folders
//       const { data: folders, error: folderError } = await supabase
//         .from("folders")
//         .select("*")
//         .eq("parent_folder_id", folderId);

//       if (folderError) {
//         return new Response(JSON.stringify({ error: folderError.message }), {
//           status: 500,
//         });
//       }

//       // Get files within the folder
//       const { data: files, error: fileError } = await supabase
//         .from("files")
//         .select("*")
//         .eq("folder_id", folderId);

//       if (fileError) {
//         return new Response(JSON.stringify({ error: fileError.message }), {
//           status: 500,
//         });
//       }

//       return new Response(JSON.stringify({ folders, files }), {
//         status: 200,
//       });
//     }
//     // If viewing the root of Shared Page
//     else {
//       // Get shared folders at root level
//       const { data: folders, error: folderError } = await supabase
//         .from("share_items")
//         .select(
//           `
//     folder_id,
//     folders:folder_id (*)
//   `
//         )
//         .eq("share_with", userId)
//         .is("file_id", null) // Make sure it's checking for file_id null
//         .eq("item_type", "folder");

//       if (folderError) {
//         return new Response(JSON.stringify({ error: folderError.message }), {
//           status: 500,
//         });
//       }
//       console.log("Folders", folders);

//       // Get shared files at root level
//       const { data: files, error: fileError } = await supabase
//         .from("share_items")
//         .select(
//           `
//         file_id,
//         files:file_id (*)
//       `
//         )
//         .eq("share_with", userId)
//         .is("folder_id", null)
//         .eq("item_type", "file");

//       if (fileError) {
//         return new Response(JSON.stringify({ error: fileError.message }), {
//           status: 500,
//         });
//       }
//       console.log("files", files);

//       return new Response(JSON.stringify({ folders, files }), {
//         status: 200,
//       });
//     }
//   } catch (error) {
//     return new Response(
//       JSON.stringify({
//         error: "Something went wrong.",
//         details: error.message,
//       }),
//       { status: 500 }
//     );
//   }
// }
