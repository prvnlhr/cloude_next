const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function getStoragePageContent(userId: string, folderId: string) {
  try {
    const params = new URLSearchParams();
    params.append("userId", userId);
    params.append("folderId", folderId);

    const filesResponse = await fetch(
      `${BASE_URL}/api/user/files?${params.toString()}`
    );

    const folderResponse = await fetch(
      `${BASE_URL}/api/user/folders?${params.toString()}`
    );
    const { files } = await filesResponse.json();
    const { folders } = await folderResponse.json();
    // console.log(" files:", files);
    // console.log(" folders:", folders);

    return { files, folders };
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch storage page content ${error}`);
  }
}
