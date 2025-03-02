import { createClient } from "@/middlewares/supabase/server";
import { getFileExtension } from "@/utils/categoryUtils";
import slugify from "slugify";

// Helper function to standardize API responses
const createResponse = (status, data = null, error = null, message = null) => {
  return new Response(JSON.stringify({ status, data, error, message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// POST : UPLOAD A FOLDER AND ITS CONTENT --------------------------------------------------------------------------------------------------

export async function POST(req) {
  try {
    const formData = await req.formData();
    const folders = JSON.parse(formData.get("folders"));
    const userId = formData.get("userId");

    const files = [];
    const fileData = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file-")) {
        const index = key.split("-")[1];
        files.push(value);
        fileData.push(JSON.parse(formData.get(`fileData-${index}`)));
      }
    }

    // Keeping track of parent folder id -> will be used later for inserting into activities
    let parentFolderId = null;

    const supabase = await createClient();
    const folderIdMap = {};

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

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const metadata = fileData[i];
      const folderId = folderIdMap[metadata.folderId];

      const uniqueId = crypto.randomUUID();
      const uniqueFileName = `${uniqueId}_${file.name}`;
      const storagePath = `uploads/${userId}/${uniqueFileName}`;

      const fileBuffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from("cloude")
        .upload(storagePath, fileBuffer, {
          contentType: metadata.type,
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        continue;
      }

      const ext = getFileExtension(file.name);

      const { error: fileError } = await supabase.from("files").insert([
        {
          file_name: metadata.name,
          file_type: metadata.type,
          file_size: metadata.size,
          storage_path: storagePath,
          folder_id: folderId,
          user_id: metadata.userId,
          extension: ext,
        },
      ]);

      if (fileError) {
        console.error("Error inserting file metadata:", fileError);
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
      null,
      null,
      "Folder and files uploaded successfully"
    );
  } catch (error) {
    console.error("POST Error:", error);
    return createResponse(
      500,
      null,
      error.message,
      "Error in uploading folder"
    );
  }
}

//  GET ALL FOLDERS AND ITS CONTENT ---------------------------------------------------------------------------------------------------------
export async function GET(req) {
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
    return createResponse(
      500,
      null,
      error.message,
      "Error in fetching folders of user"
    );
  }
}
