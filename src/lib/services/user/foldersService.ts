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

type Folder = {
  id: string;
  name: string;
  parentFolderId: string | null;
  userId: string;
};

type FileData = {
  name: string;
  type: string;
  size: number;
  folderId: string;
  userId: string;
  file: File;
};

export async function uploadFolder(
  filesArray: FileData[],
  foldersArray: Folder[],
  userId: string,
  showToast: (
    type: "loading" | "success" | "error",
    title: string,
    description?: string,
    toastId?: string | number
  ) => string | number
) {
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
    const folderName = foldersArray[0].name;

    // show loading toast
    const toastId = showToast(
      "loading",
      "Uploading Folder",
      `Uploading ${folderName}...`
    );

    const uploadResponse = await fetch(`${BASE_URL}/api/user/folders`, {
      method: "POST",
      body: formData,
    });

    const result = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error("Upload Folder Error:", result.error || result.message);

      showToast(
        "error",
        "Upload Failed",
        `Failed to upload ${folderName}: ${result.error || result.message}`,
        toastId
      );

      throw new Error(
        result.error ||
          result.message ||
          "Failed to upload folder and its content"
      );
    }

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");

    // show success toast
    showToast(
      "success",
      "Upload Successful",
      `Uploaded ${folderName} successfully!`,
      toastId
    );

    console.log("Upload Folder Success:", result.message);
    return result.data;
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
