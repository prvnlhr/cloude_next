const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Shares an item (file or folder) with another user via email.
 * @param shareItemData.itemId - The ID of the item to share.
 * @param shareItemData.itemType - The type of the item (e.g., "file" or "folder").
 * @param shareItemData.sharedById - The ID of the user sharing the item.
 * @param shareItemData.shareWithEmail - The email of the user to share the item with.
 * @returns The response data from the API.
 * @throws An error if the API request fails.
 */

export async function shareItem(shareItemData: {
  itemId: string;
  itemType: string;
  sharedById: string;
  shareWithEmail: string;
}): Promise<any> {
  try {
    console.log(shareItemData);
    const response = await fetch(`${BASE_URL}/api/share/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shareItemData),
      next: { tags: ["share"] },
    });

    const responseData = await response.json();
    if (!response.ok) {
      const errorMessage =
        responseData.error ||
        responseData.message ||
        "Failed to share content.";

      throw {
        status: response.status,
        message: errorMessage,
        data: responseData,
      };
    }
    return responseData;
  } catch (error) {
    console.error("Error sharing content:", error);
    if (error.status && error.message) {
      throw error;
    }
    throw {
      status: 500,
      message: error.message || "Network error or server unreachable",
      data: null,
    };
  }
}

export async function fetchSharedContent(userId, folderId, queryParams) {
  try {
    const params = new URLSearchParams({ userId: encodeURIComponent(userId) });
    if (folderId) {
      params.append("folderId", encodeURIComponent(folderId));
    }
    if (queryParams && queryParams.myshared === "true") {
      params.append("shareByMe", "true");
    }

    const response = await fetch(`${BASE_URL}/api/share?${params.toString()}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error occurred");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get shared content:", error);
    throw new Error(`Failed to get shared content: ${error.message}`);
  }
}
