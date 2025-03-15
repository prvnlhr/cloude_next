import { revalidateTagHandler } from "@/lib/revalidation";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "https://cloude-next.vercel.app";

interface UpdateData {
  updateName: string;
  userId: string;
  itemId: string;
  itemOwnerId: string;
  accessLevel: string;
}
import { UploadFileData, UploadFolderData } from "@/utils/folderProcessUtils";

export async function uploadFolder(
  filesArray: UploadFileData[],
  foldersArray: UploadFolderData[],
  userId: string,
  showToast: (
    type: "loading" | "success" | "error",
    title: string,
    description?: string,
    toastId?: string | number
  ) => string | number
) {
  try {
    const folderName = foldersArray[0].name;

    // show loading toast
    const toastId = showToast(
      "loading",
      "Uploading in Progress",
      `${folderName} is being uploaded`
    );

    const response = await fetch(`${BASE_URL}/api/user/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folders: foldersArray, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload folder structure");
    }

    const foldersResponse = await response.json();
    const folderIdMap = await foldersResponse?.data;

    const updatedFilesArray = filesArray.map((fileData) => ({
      ...fileData,
      folderId: folderIdMap[fileData.folderId],
    }));

    const uploadFilesPromises = updatedFilesArray.map(async (fileData) => {
      const formData = new FormData();
      formData.append("file", fileData.file);
      formData.append("name", fileData.name);
      formData.append("userId", userId);
      formData.append("folderId", fileData.folderId);
      formData.append("isFolderUpload", "true");

      try {
        const uploadResponse = await fetch(`${BASE_URL}/api/user/files`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Failed to upload file");
        }

        const result = await uploadResponse.json();
        console.log(`File uploaded successfully`);
        return result.data;
      } catch (error) {
        console.error(`Failed to upload file ${fileData.name}:`, error);
        throw error;
      }
    });

    // Wait for all file uploads to complete
    const promiseResponse = await Promise.all(uploadFilesPromises);

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");

    // show success toast
    showToast(
      "success",
      "Folder Uploaded Successfully",
      `${folderName} has been uploaded`,
      toastId
    );
    console.log("Upload Folder Success:", promiseResponse);
  } catch (error) {
    const err = error as Error;

    console.error("Upload Folder Error:", error);
    throw new Error(`Failed to upload folder: ${err.message}`);
  }
}

export async function renameFolder(
  updateData: UpdateData,
  folderId: string,
  showToast: (
    type: "loading" | "success" | "error",
    title: string,
    description?: string
  ) => void
) {
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
      showToast(
        "error",
        `Renaming folder failed`,
        `${result.error || result.message}`
      );
      throw new Error(
        result.error || result.message || "Failed to rename folder"
      );
    }

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");
    await revalidateTagHandler("starred");
    await revalidateTagHandler("shared");

    showToast("success", `Folder renamed successfully`, ``);

    console.log("Rename Folder Success:", result.message);
    return result.data;
  } catch (error) {
    const err = error as Error;

    console.error("Rename Folder Error:", error);
    throw new Error(`Failed to rename folder: ${err.message}`);
  }
}

export async function deleteFolder(
  userId: string,
  itemId: string,
  accessLevel: string,
  itemOwnerId: string,
  showToast: (
    type: "loading" | "success" | "error",
    title: string,
    description?: string,
    toastId?: string | number
  ) => string | number
) {
  try {
    const deleteResponse = await fetch(
      `${BASE_URL}/api/user/folders/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, userId, accessLevel, itemOwnerId }),
      }
    );

    const result = await deleteResponse.json();

    if (!deleteResponse.ok) {
      console.error("Delete Folder Error:", result.error || result.message);

      showToast(
        "error",
        `Deleting folder failed`,
        `${result.error || result.message}`
      );
      throw new Error(
        result.error || result.message || "Failed to delete folder"
      );
    }

    showToast("success", `Folder deleted successfully`, ``);

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");
    await revalidateTagHandler("starred");
    await revalidateTagHandler("shared");

    console.log("Delete Folder Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Delete Folder Error:", error);
    const err = error as Error;
    throw new Error(`Failed to delete folder: ${err.message}`);
  }
}
