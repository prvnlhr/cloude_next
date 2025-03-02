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

    const result = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error("Upload Folder Error:", result.error || result.message);
      throw new Error(
        result.error ||
          result.message ||
          "Failed to upload folder and its content"
      );
    }

    console.log("Upload Folder Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Upload Folder Error:", error);
    throw new Error(`Failed to upload folder: ${error.message}`);
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

    const result = await renameResponse.json();

    if (!renameResponse.ok) {
      console.error("Rename Folder Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to rename folder"
      );
    }

    console.log("Rename Folder Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Rename Folder Error:", error);
    throw new Error(`Failed to rename folder: ${error.message}`);
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

    const result = await deleteResponse.json();

    if (!deleteResponse.ok) {
      console.error("Delete Folder Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to delete folder"
      );
    }

    console.log("Delete Folder Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Delete Folder Error:", error);
    throw new Error(`Failed to delete folder: ${error.message}`);
  }
}
