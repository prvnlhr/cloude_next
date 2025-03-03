const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function fetchUserStorageContent(userId, folderId) {
  try {
    const params = new URLSearchParams({ userId, folderId });

    const [filesResponse, foldersResponse] = await Promise.all([
      fetch(`${BASE_URL}/api/user/files?${params.toString()}`, {
        next: { revalidate: false, tags: ["storage"] },
      }),

      fetch(`${BASE_URL}/api/user/folders?${params.toString()}`),
    ]);

    const filesResult = await filesResponse.json();
    const foldersResult = await foldersResponse.json();

    if (!filesResponse.ok) {
      console.error(
        "Fetch Files Error:",
        filesResult.error || filesResult.message
      );
      throw new Error(
        filesResult.error || filesResult.message || "Failed to fetch files."
      );
    }

    if (!foldersResponse.ok) {
      console.error(
        "Fetch Folders Error:",
        foldersResult.error || foldersResult.message
      );
      throw new Error(
        foldersResult.error ||
          foldersResult.message ||
          "Failed to fetch folders."
      );
    }

    console.log("Fetch Storage Content Success:", {
      filesMessage: filesResult.message,
      foldersMessage: foldersResult.message,
    });

    return {
      files: filesResult.data,
      folders: foldersResult.data,
    };
  } catch (error) {
    console.error("Fetch Storage Content Error:", error);
    throw new Error(`Failed to fetch storage content: ${error.message}`);
  }
}
