import { createClient } from "@/middlewares/supabase/server";
import { createResponse } from "@/utils/apiResponseUtils";
import slugify from "slugify";

// POST : UPLOAD A FOLDER AND ITS CONTENT --------------------------------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { folders, userId } = await req.json();

    let parentFolderId = null;

    const supabase = await createClient();
    const folderIdMap: Record<string, string> = {};

    if (folders[0].parentFolderId !== null) {
      folderIdMap[folders[0].parentFolderId] = folders[0].parentFolderId;
    }

    for (const folder of folders) {
      const slug = slugify(folder.name, { lower: true, strict: true });

      const currentParentFolderId = folder.parentFolderId
        ? folderIdMap[folder.parentFolderId] || null
        : null;

      const { data: folderData, error: folderError } = await supabase
        .from("folders")
        .insert([
          {
            folder_name: folder.name,
            slug: slug,
            parent_folder_id: currentParentFolderId,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (folderError) {
        console.error("Error inserting folder:", folderError);
        continue;
      }

      folderIdMap[folder.id] = folderData.id;

      if (!parentFolderId && !folder.parentFolderId) {
        parentFolderId = folderData.id;
      }
    }

    // Log the parent folder creation activity at the end
    if (parentFolderId) {
      const { error: activityError } = await supabase
        .from("activities")
        .insert([
          {
            activity_type: "upload",
            item_type: "folder",
            file_id: null,
            folder_id: parentFolderId,
            user_id: userId,
            details: null,
          },
        ]);

      if (activityError) {
        console.error("Error logging folder upload activity:", activityError);
      }
    }

    return createResponse(
      201,
      folderIdMap,
      null,
      "Folder and files uploaded successfully"
    );
  } catch (error) {
    console.error("POST Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(500, null, errorMessage, "Error in uploading folder");
  }
}

//  GET ALL FOLDERS AND ITS CONTENT ---------------------------------------------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const folderIdRaw = searchParams.get("folderId");
    const folderId = folderIdRaw === "null" ? null : folderIdRaw;

    if (!userId) {
      return createResponse(400, null, "UserId is required");
    }

    const supabase = await createClient();

    let query = supabase.from("folders").select("*").eq("user_id", userId);

    if (folderId === null) {
      query = query.is("parent_folder_id", null);
    } else {
      query = query.eq("parent_folder_id", folderId);
    }

    const { data: folders, error: fetchError } = await query;

    if (fetchError) {
      throw new Error("Failed to fetch folders: " + fetchError.message);
    }

    return createResponse(200, folders, null, "Folders fetched successfully");
  } catch (error) {
    console.error("GET Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(
      500,
      null,
      errorMessage,
      "Error in fetching folders of user"
    );
  }
}
