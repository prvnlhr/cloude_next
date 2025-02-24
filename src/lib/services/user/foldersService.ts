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
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to upload users files ${error}`);
  }
}
