import { createClient } from "@/middlewares/supabase/server";
import slugify from "slugify";

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Parse folders and userId from FormData
    const folders = JSON.parse(formData.get("folders"));
    const userId = formData.get("userId");

    // Extract files and their metadata
    const files = [];
    const fileData = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file-")) {
        const index = key.split("-")[1];
        files.push(value);
        fileData.push(JSON.parse(formData.get(`fileData-${index}`))); // The metadata
      }
    }

    console.log("folders:", folders);
    console.log("fileData:", fileData);

    // return new Response(
    //   JSON.stringify({ message: "Folder and files uploaded successfully" }),
    //   {
    //     status: 201,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    const supabase = await createClient();

    // Step 1: Insert folders and create a folderIdMap
    const folderIdMap = {};

    for (const folder of folders) {
      const slug = slugify(folder.name, { lower: true, strict: true });

      const parentFolderId = folder.parentFolderId
        ? folderIdMap[folder.parentFolderId] // Resolve using folderIdMap
        : null;

      const { data: folderData, error: folderError } = await supabase
        .from("folders")
        .insert([
          {
            folder_name: folder.name,
            slug: slug,
            parent_folder_id: parentFolderId,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (folderError) {
        console.error("Error inserting folder:", folderError);
        continue;
      }

      // Map the temporary folder ID to the database-generated ID
      folderIdMap[folder.id] = folderData.id;
    }

    console.log("folderIdMap:", folderIdMap);

    // Step 2: Insert files
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
    }

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
