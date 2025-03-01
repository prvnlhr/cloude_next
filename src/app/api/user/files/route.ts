import { createClient } from "@/middlewares/supabase/server";
import { getFileExtension } from "@/utils/categoryUtils";

// Function to upload a file to storage
const uploadToStorage = async (file: any, userId: string) => {
  try {
    const supabase = await createClient();
    const uniqueId = crypto.randomUUID();
    const uniqueFileName = `${uniqueId}_${file.name}`;
    const filePath = `uploads/${userId}/${uniqueFileName}`;
    const { data, error: uploadError } = await supabase.storage
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

//  Upload File
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");
    const folderId = formData.get("folderId") || null;
    console.log(" file:", file);
    console.log(" userId:", userId);
    console.log(" folderId:", folderId);

    if (!file || !userId) {
      return new Response(
        JSON.stringify({ error: "File and UserId are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabase = await createClient();

    const filePath = await uploadToStorage(file, userId);

    const ext = getFileExtension(file.name);

    const { data: insertData, error: insertError } = await supabase
      .from("files")
      .insert([
        {
          user_id: userId,
          folder_id: folderId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: filePath,
          extension: ext,
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw new Error("Failed to insert file metadata: " + insertError.message);
    }
    // Log the upload activity in the activities table
    const { error: activityError } = await supabase.from("activities").insert([
      {
        activity_type: "upload",
        item_type: "file",
        file_id: insertData.id, // The ID of the inserted file
        folder_id: null, // Ensure folder_id is null for file uploads
        user_id: userId, // The user who uploaded the file
        details: null, // No additional details needed for uploads
      },
    ]);

    if (activityError) {
      console.error("Error logging upload activity:", activityError);
      // Optionally, you can handle this error without failing the entire operation
    }

    return new Response(JSON.stringify({ insertData }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("POST Error:", error);
    return new Response(
      JSON.stringify({
        error: error,
        message: "Error in uploading file/files",
      }),
      {
        status: 500,
      }
    );
  }
}

// Get all files of user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const folderIdRaw = searchParams.get("folderId");
    const folderId = folderIdRaw === "null" ? null : folderIdRaw;

    if (!userId) {
      return new Response(JSON.stringify({ error: "UserId is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const supabase = await createClient();

    let query = supabase.from("files").select("*").eq("user_id", userId);

    if (folderId !== null) {
      query = query.eq("folder_id", folderId);
    } else {
      query = query.is("folder_id", null); // Use .is() for NULL checks
    }

    const { data: files, error: fetchError } = await query;

    return new Response(JSON.stringify({ files }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("GET Error:", error);
    return new Response(
      JSON.stringify({
        error: error,
        message: "Error in fetching files of user",
      }),
      {
        status: 500,
      }
    );
  }
}
