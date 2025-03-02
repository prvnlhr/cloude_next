import { revalidateTagHandler } from "@/lib/revalidation";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function uploadFiles(filesDataArray, userId, folderId) {
  const responses = [];
  try {
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

      const result = await uploadResponse.json();

      if (!uploadResponse.ok) {
        console.error("Upload Error:", result.error || result.message);
        throw new Error(
          result.error || result.message || "Failed to upload file"
        );
      }

      await revalidateTagHandler("storage");
      await revalidateTagHandler("dashboard");
      console.log("Upload Success:", result.message);
      responses.push(result.data);
    }
    return responses;
  } catch (error) {
    console.error("Upload Files Error:", error);
    throw new Error(`Failed to upload files: ${error.message}`);
  }
}

export async function getFile(userId, fileId) {
  try {
    const params = new URLSearchParams({ userId: encodeURIComponent(userId) });
    const uploadResponse = await fetch(
      `${BASE_URL}/api/user/files/${fileId}?${params.toString()}`
    );

    const result = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error("Get File Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to get user's file"
      );
    }

    console.log("Get File Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Get File Error:", error);
    throw new Error(`Failed to get user's file: ${error.message}`);
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

    const result = await renameResponse.json();

    if (!renameResponse.ok) {
      console.error("Rename Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to rename file"
      );
    }
    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");

    console.log("Rename Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Rename File Error:", error);
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

    const result = await deleteResponse.json();

    if (!deleteResponse.ok) {
      console.error("Delete Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to delete file"
      );
    }
    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");

    console.log("Delete Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Delete File Error:", error);
    throw new Error(`Failed to delete user's file: ${error.message}`);
  }
}
