const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Fetches files and folders for a specific user and folder from the storage API.
 * @param userId - The ID of the user.
 * @param folderId - The ID of the folder to fetch content from.
 * @returns An object containing `files` and `folders`.
 * @throws An error if the request fails or the response is invalid.
 */

export async function fetchUserStorageContent(
  userId: string,
  folderId: string
): Promise<{ files: any[]; folders: any[] }> {
  try {
    const params = new URLSearchParams({ userId, folderId });

    const [filesResponse, foldersResponse] = await Promise.all([
      fetch(`${BASE_URL}/api/user/files?${params.toString()}`, {
        next: { tags: ["storage"] },
      }),
      fetch(`${BASE_URL}/api/user/folders?${params.toString()}`),
    ]);

    if (!filesResponse.ok || !foldersResponse.ok) {
      throw new Error("Failed to fetch storage content: API request failed.");
    }

    const { files } = await filesResponse.json();
    const { folders } = await foldersResponse.json();

    return { files, folders };
  } catch (error) {
    console.error("Error fetching storage content:", error);
    throw new Error(`Failed to fetch storage content: ${error.message}`);
  }
}
