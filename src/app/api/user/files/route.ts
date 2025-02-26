import { createClient } from "@/middlewares/supabase/server";

// Function to fetch files with signed URLs
const fetchFilesWithSignedUrls = async (userId: string, folderId = null) => {
  try {
    const supabase = await createClient();

    let query = supabase.from("files").select("*").eq("user_id", userId);

    if (folderId === null) {
      query = query.is("folder_id", null);
    } else {
      query = query.eq("folder_id", folderId);
    }
    const { data: files, error: fetchError } = await query;

    if (fetchError) {
      throw new Error("Failed to fetch files: " + fetchError.message);
    }
    // Generate signed URLs for each file
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        // console.log("file->storage_path", file.storage_path);
        const { data: signedUrl, error: urlError } = await supabase.storage
          .from("cloude")
          .createSignedUrl(file.storage_path, 3600); // URL expires in 1 hour

        if (urlError) {
          console.error(
            "Error generating signed URL for:",
            file.storage_path,
            urlError
          );
          return { ...file, signedUrl: null };
        }

        return {
          ...file,
          signedUrl: signedUrl?.signedUrl,
        };
      })
    );

    return filesWithUrls;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

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
    const fileName = formData.get("name");
    const userId = formData.get("userId");
    const folderId = formData.get("folderId") || null;

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

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const filePath = await uploadToStorage(file, userId);

    // Insert file metadata to the database
    const { data: insertData, error: insertError } = await supabase
      .from("files")
      .insert([
        {
          user_id: userId,
          folder_id: folderId,
          file_name: fileName,
          file_type: file.type,
          file_size: file.size,
          storage_path: filePath,
        },
      ]);

    if (insertError) {
      throw new Error("Failed to insert file metadata: " + insertError.message);
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

    // TODO :: getting error
    // const filesWithUrls = await fetchFilesWithSignedUrls(userId, folderId);

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
