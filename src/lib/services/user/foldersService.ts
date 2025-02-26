import { revalidatePathHandler } from "@/lib/revalidation";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function uploadFolder(filesArray, foldersArray, userId) {
  try {
    const formData = new FormData();
    formData.append("folders", JSON.stringify(foldersArray));
    formData.append("userId", userId);

    filesArray.forEach((fileData, index) => {
      formData.append(`file-${index}`, fileData.file);
      formData.append(
        `fileData-${index}`,
        JSON.stringify({
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
          folderId: fileData.folderId,
          userId: fileData.userId,
        })
      );
    });
    const uploadResponse = await fetch(`${BASE_URL}/api/user/folders`, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload folder and its content`);
    }
    await revalidatePathHandler("/cloude/home", "layout");
    const data = await uploadResponse.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to upload users files ${error}`);
  }
}

export async function renameFolder(updateData, folderId) {
  try {
    const renameResponse = await fetch(
      `${BASE_URL}/api/user/folders/${folderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!renameResponse.ok) {
      const errorData = await renameResponse.json();
      throw new Error(errorData.message || "Failed to rename file.");
    }
    await revalidatePathHandler("/cloude/home", "layout");
    const data = await renameResponse.json();
    return data;
  } catch (error) {
    console.error("Failed to rename file:", error);
    throw new Error(`Failed to rename user's file: ${error.message}`);
  }
}

export async function deleteFolder(userId, itemId) {
  try {
    const deleteResponse = await fetch(
      `${BASE_URL}/api/user/folders/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, userId }),
      }
    );

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      throw new Error(errorData.message || "Failed to delete folder.");
    }

    await revalidatePathHandler("/cloude/home", "layout");

    const data = await deleteResponse.json();
    return data;
  } catch (error) {
    console.error("Failed to delete folder:", error);
    throw new Error(`Failed to delete user's folder: ${error.message}`);
  }
}
