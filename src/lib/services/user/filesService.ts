import { revalidateTagHandler } from "@/lib/revalidation";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "https://cloude-next.vercel.app";

type FileData = {
  name: string;
  type: string;
  size: string;
  file: File;
};
interface UpdateData {
  updateName: string;
  userId: string;
  itemId: string;
  itemOwnerId: string;
  accessLevel: string;
}

export async function uploadFiles(
  filesDataArray: FileData[],
  userId: string,
  folderId: string | null,
  showToast: (
    type: "loading" | "success" | "error",
    title: string,
    description?: string,
    toastId?: string | number
  ) => string | number
) {
  try {
    const uploadPromises = filesDataArray.map(async (fileDataObject) => {
      const formData = new FormData();
      formData.append("file", fileDataObject.file);
      formData.append("name", fileDataObject.name);
      formData.append("type", fileDataObject.type);
      formData.append("size", fileDataObject.size);
      formData.append("userId", userId);
      formData.append("folderId", folderId || "");

      // show loading toast
      const toastId = showToast(
        "loading",
        "Uploading File",
        `Uploading ${fileDataObject.name}...`
      );

      try {
        const uploadResponse = await fetch(`${BASE_URL}/api/user/files`, {
          method: "POST",
          body: formData,
        });

        const result = await uploadResponse.json();

        if (!uploadResponse.ok) {
          console.error("Upload Error:", result.error || result.message);
          // show error toast
          showToast(
            "error",
            "Upload Failed",
            `Failed to upload ${fileDataObject.name}: ${
              result.error || result.message
            }`,
            toastId
          );
          throw new Error(
            result.error || result.message || "Failed to upload file"
          );
        }

        // show success toast
        showToast(
          "success",
          "Upload Successful",
          `Uploaded ${fileDataObject.name} successfully!`,
          toastId
        );
        console.log("Upload Success:", result.message);
        return result.data;
      } catch (error) {
        console.error("Upload Error:", error);
        // show error toast
        const err = error as Error;
        showToast(
          "error",
          "Upload Failed",
          `Failed to upload ${fileDataObject.name}: ${err.message}`,
          toastId
        );
        throw error;
      }
    });

    // Wait for all uploads to complete
    const responses = await Promise.all(uploadPromises);

    // Revalidate tags after all files are uploaded
    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");

    return responses;
  } catch (error) {
    const err = error as Error;
    console.error("Upload Files Error:", error);
    throw new Error(`Failed to upload files: ${err.message}`);
  }
}

export async function getFile(userId: string, fileId: string) {
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
    const err = error as Error;

    console.error("Get File Error:", error);
    throw new Error(`Failed to get user's file: ${err.message}`);
  }
}

export async function renameFile(
  updateData: UpdateData,
  fileId: string,
  showToast: (
    type: "loading" | "success" | "error",
    title: string,
    description?: string
  ) => void
) {
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
      showToast(
        "error",
        `Renaming File failed`,
        `${result.error || result.message}`
      );
      throw new Error(
        result.error || result.message || "Failed to rename file"
      );
    }

    showToast("success", `File renamed successfully`, ``);

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");
    await revalidateTagHandler("starred");
    await revalidateTagHandler("shared");

    console.log("Rename Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Rename File Error:", error);
    const err = error as Error;
    throw new Error(`Failed to rename user's file: ${err.message}`);
  }
}

export async function deleteFile(
  userId: string,
  itemId: string,
  accessLevel: string,
  itemOwnerId: string,
  showToast: (
    type: "loading" | "success" | "error",
    title: string,
    description?: string
  ) => void
) {
  try {
    const deleteResponse = await fetch(`${BASE_URL}/api/user/files/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId, userId, accessLevel, itemOwnerId }),
    });

    const result = await deleteResponse.json();

    if (!deleteResponse.ok) {
      console.error("Delete Error:", result.error || result.message);
      showToast(
        "error",
        `Deleting File failed`,
        `${result.error || result.message}`
      );
      throw new Error(
        result.error || result.message || "Failed to delete file"
      );
    }
    showToast("success", `File deleted successfully`, ``);

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");
    await revalidateTagHandler("starred");
    await revalidateTagHandler("shared");

    console.log("Delete Success:", result.message);
    return result.data;
  } catch (error) {
    const err = error as Error;

    console.error("Delete File Error:", error);
    throw new Error(`Failed to delete user's file: ${err.message}`);
  }
}
