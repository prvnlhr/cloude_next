import {
  revalidatePathHandler,
  revalidateTagHandler,
} from "@/lib/revalidation";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function uploadFiles(filesDataArray, userId, folderId) {
  const responses = [];
  try {
    let index = 1;
    for (const fileDataObject of filesDataArray) {
      const formData = new FormData();
      formData.append("file", fileDataObject.file);
      formData.append("name", fileDataObject.name);
      formData.append("type", fileDataObject.type);
      formData.append("size", fileDataObject.size);
      formData.append("userId", userId);
      formData.append("folderId", folderId || "");

      const uploadResponse = await fetch(`${BASE_URL}/api/user/files`, {
        method: "POST",
        body: formData,
      });
      console.log(index, uploadResponse);
      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file`);
      }
      const data = await uploadResponse.json();
      responses.push(data);

      index++;
    }
    await revalidatePathHandler("/cloude/home", "layout");
    return responses;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to upload users files ${error}`);
  }
}

// -> NOT IN USE
export async function getFile(userId, fileId) {
  try {
    const params = new URLSearchParams({ userId: encodeURIComponent(userId) });
    const uploadResponse = await fetch(
      `${BASE_URL}/api/user/files/${fileId}?${params.toString()}`
    );

    if (!uploadResponse.ok) {
      throw new Error("Failed to get user's file");
    }
    return uploadResponse.json();
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to get user's file ${error}`);
  }
}

export async function renameFile(updateData, fileId) {
  try {
    const renameResponse = await fetch(`${BASE_URL}/api/user/files/${fileId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

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

export async function deleteFile(userId, itemId) {
  try {
    const deleteResponse = await fetch(`${BASE_URL}/api/user/files/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId, userId }),
    });

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      throw new Error(errorData.message || "Failed to delete file.");
    }

    await revalidatePathHandler("/cloude/home", "layout");

    const data = await deleteResponse.json();
    return data;
  } catch (error) {
    console.error("Failed to delete file:", error);
    throw new Error(`Failed to delete user's file: ${error.message}`);
  }
}
