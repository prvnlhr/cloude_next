import { createClient } from "@/middlewares/supabase/server";
import slugify from "slugify";

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

    const supabase = await createClient();
    const folderIdMap = {};

    if (folders[0]?.parentFolderId) {
      folderIdMap[folders[0].parentFolderId] = folders[0].parentFolderId;
    }

    const folderInserts = folders.map(async (folder) => {
      const slug = slugify(folder.name, { lower: true, strict: true });
      const parentFolderId = folder.parentFolderId
        ? folderIdMap[folder.parentFolderId] || null
        : null;

      const { data: folderData, error: folderError } = await supabase
        .from("folders")
        .insert([
          {
            folder_name: folder.name,
            slug,
            parent_folder_id: parentFolderId,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (folderError) {
        console.error("Error inserting folder:", folderError);
        return null;
      }

      folderIdMap[folder.id] = folderData.id;
    });

    await Promise.all(folderInserts);

    const uploadPromises = files.map(async (file, index) => {
      const metadata = fileData[index];
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
        return null;
      }

      const { error: fileError } = await supabase.from("files").insert([
        {
          file_name: metadata.name,
          file_type: metadata.type,
          file_size: metadata.size,
          storage_path: storagePath,
          folder_id: folderId,
          user_id: metadata.userId,
        },
      ]);

      if (fileError) {
        console.error("Error inserting file metadata:", fileError);
      }
    });

    await Promise.all(uploadPromises);

    return new Response(
      JSON.stringify({ message: "Folder and files uploaded successfully" }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        message: "Error in uploading folder",
      }),
      {
        status: 500,
      }
    );
  }
}

// get all folders
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

    let query = supabase.from("folders").select("*").eq("user_id", userId);

    if (folderId === null) {
      query = query.is("parent_folder_id", null);
    } else {
      query = query.eq("parent_folder_id", folderId);
    }

    const { data: folders, error: fetchError } = await query;

    return new Response(JSON.stringify({ folders }), {
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
        message: "Error in fetching folders of user",
      }),
      {
        status: 500,
      }
    );
  }
}
