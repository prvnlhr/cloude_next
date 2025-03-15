import { createClient } from "@/middlewares/supabase/server";
import { getFileExtension } from "@/utils/categoryUtils";
import { Activity } from "@/types/fileType";
import { createResponse } from "@/utils/apiResponseUtils";

// Function to upload a file to storage
const uploadToStorage = async (file: File, userId: string) => {
  try {
    const supabase = await createClient();
    const uniqueId = crypto.randomUUID();
    const uniqueFileName = `${uniqueId}_${file.name}`;
    const filePath = `uploads/${userId}/${uniqueFileName}`;
    const { error: uploadError } = await supabase.storage
      .from("cloude")
      .upload(filePath, file, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      throw new Error("Failed to upload file: " + uploadError.message);
    }
    return filePath;
  } catch (error) {
    console.error("Storage Upload Error:", error);
    throw error;
  }
};

// POST : UPLOAD FILE -----------------------------------------------------------------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const folderId = formData.get("folderId") || null;
    const fileName = formData.get("name") as string;
    const isFolderUpload = formData.get("isFolderUpload") === "true";
    if (!file || !userId) {
      return createResponse(400, null, "File and UserId are required");
    }

    const supabase = await createClient();
    const filePath = await uploadToStorage(file, userId);
    const ext = getFileExtension(file.name);

    const fileMetadata = {
      user_id: userId,
      folder_id: folderId,
      file_name: fileName,
      file_type: file.type,
      file_size: file.size,
      storage_path: filePath,
      extension: ext,
    };

    const { data: insertData, error: insertError } = await supabase
      .from("files")
      .insert([fileMetadata])
      .select()
      .single();

    if (insertError) {
      throw new Error("Failed to insert file metadata: " + insertError.message);
    }

    if (!isFolderUpload) {
      const activity: Activity = {
        activity_type: "upload",
        item_type: "file",
        file_id: insertData.id,
        folder_id: null,
        user_id: userId,
        details: null,
      };

      const { error: activityError } = await supabase
        .from("activities")
        .insert([activity]);

      if (activityError) {
        console.error("Error logging upload activity:", activityError);
      }
    }

    return createResponse(201, insertData, null, "File uploaded successfully");
  } catch (error) {
    console.error("POST Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(
      500,
      null,
      errorMessage,
      "Error in uploading file/files"
    );
  }
}

// GET : ALL USER'S FILES  -------------------------------------------------------------------------------------------------------------------------------------
export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const folderIdRaw = searchParams.get("folderId");
    const folderId = folderIdRaw === "null" ? null : folderIdRaw;

    if (!userId) {
      return createResponse(400, null, "UserId is required");
    }

    const supabase = await createClient();
    let query = supabase.from("files").select("*").eq("user_id", userId);

    if (folderId !== null) {
      query = query.eq("folder_id", folderId);
    } else {
      query = query.is("folder_id", null);
    }

    const { data: files, error: fetchError } = await query;

    if (fetchError) {
      throw new Error("Failed to fetch files: " + fetchError.message);
    }

    return createResponse(200, files, null, "Files fetched successfully");
  } catch (error) {
    console.error("GET Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(
      500,
      null,
      errorMessage,
      "Error in fetching files of user"
    );
  }
}
