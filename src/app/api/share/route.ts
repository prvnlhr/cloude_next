import { createClient } from "@/middlewares/supabase/server";
export async function POST(req) {
  try {
    const formData = await req.formData();
    const itemId = formData.get("itemId");
    const itemType = formData.get("itemType");
    const userId = formData.get("userId");
    const shareWithEmail = formData.get("shareWithEmail");

    const supabase = await createClient();

    // Get the userId of the person to share with
    const { data: shareWithUser, error: shareWithError } = await supabase
      .from("users")
      .select("user_id")
      .eq("email", shareWithEmail)
      .single();

    console.log("check1", shareWithUser);

    if (shareWithError || !shareWithUser) {
      return new Response(
        JSON.stringify({
          error:
            shareWithError?.message || "User with this email does not exist.",
        }),
        { status: 404 }
      );
    }

    const shareWithUserId = shareWithUser.user_id;

    let isValidItem = false;

    // Check if item exists in the respective table
    if (itemType === "file") {
      const { data: file, error: fileError } = await supabase
        .from("files")
        .select("id")
        .eq("id", itemId)
        .single();
      isValidItem = !!file;
      console.log("check2.1", file);
    } else if (itemType === "folder") {
      const { data: folder, error: folderError } = await supabase
        .from("folders")
        .select("id")
        .eq("id", itemId)
        .single();
      isValidItem = !!folder;
      console.log("check2.2", folder);
    }

    console.log("check3", isValidItem);

    // If item is valid, proceed to insert into share table

    if (isValidItem) {
      console.log("isValidItem", isValidItem, itemType);
      const { data: newShare, error: shareError } = await supabase
        .from("share")
        .insert({
          file_id: itemType === "file" ? itemId : null,
          folder_id: itemType === "folder" ? itemId : null,
          item_type: itemType,
          share_by: userId,
          share_with: shareWithUserId,
          is_starred: false,
        })
        .select("*")
        .single();

      console.log("check5", newShare);
      console.log("check5.1", shareError);

      if (shareError) {
        return new Response(
          JSON.stringify({
            error: shareError.message,
            message: "Failed to share item.",
          }),
          { status: 500 }
        );
      }

      return new Response(JSON.stringify({ data: newShare }), { status: 201 });
    } else {
      console.log("check6");

      return new Response(
        JSON.stringify({
          message: "Item not found or invalid item type.",
        }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: error.message,
        message: "Error at Share file POST",
      }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const folderIdRaw = searchParams.get("folderId");
  const folderId = folderIdRaw === "null" ? null : folderIdRaw;

  const supabase = await createClient();

  try {
    // If a specific folder is opened

    if (folderId) {
      // Get child folders
      const { data: folders, error: folderError } = await supabase
        .from("folders")
        .select("*")
        .eq("parent_folder_id", folderId);

      if (folderError) {
        return new Response(JSON.stringify({ error: folderError.message }), {
          status: 500,
        });
      }

      // Get files within the folder
      const { data: files, error: fileError } = await supabase
        .from("files")
        .select("*")
        .eq("folder_id", folderId);

      if (fileError) {
        return new Response(JSON.stringify({ error: fileError.message }), {
          status: 500,
        });
      }

      return new Response(JSON.stringify({ folders, files }), {
        status: 200,
      });
    }
    // If viewing the root of Shared Page
    else {
      // Get shared folders at root level
      const { data: folders, error: folderError } = await supabase
        .from("share")
        .select(
          `
    folder_id,
    folders:folder_id (*)
  `
        )
        .eq("share_with", userId)
        .is("file_id", null) // Make sure it's checking for file_id null
        .eq("item_type", "folder");

      if (folderError) {
        return new Response(JSON.stringify({ error: folderError.message }), {
          status: 500,
        });
      }
      console.log("Folders", folders);

      // Get shared files at root level
      const { data: files, error: fileError } = await supabase
        .from("share")
        .select(
          `
        file_id,
        files:file_id (*)
      `
        )
        .eq("share_with", userId)
        .is("folder_id", null)
        .eq("item_type", "file");

      if (fileError) {
        return new Response(JSON.stringify({ error: fileError.message }), {
          status: 500,
        });
      }
      console.log("files", files);

      return new Response(JSON.stringify({ folders, files }), {
        status: 200,
      });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Something went wrong.",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
