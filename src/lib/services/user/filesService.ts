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
        // console.log(index, 'error->',uploadResponse);
        throw new Error(`Failed to upload file`);
      }
      const data = await uploadResponse.json();
      responses.push(data);
      index++;
    }
    return responses;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to upload users files ${error}`);
  }
}

export async function getUserFiles() {
  try {
    const uploadResponse = await fetch(`/api/user/files`);
    if (!uploadResponse.ok) {
      throw new Error("Failed to upload users files");
    }
    return uploadResponse.json();
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to upload users files ${error}`);
  }
}
