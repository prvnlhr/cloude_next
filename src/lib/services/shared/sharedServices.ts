import { revalidateTagHandler } from "@/lib/revalidation";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "https://cloude-next.vercel.app";

export function capitalize(word: string): string {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}
interface ShareItemData {
  itemId: string;
  itemType: string;
  sharedById: string;
  shareWithEmail: string;
  accessLevel: string;
}

/**
 * Shares an item (file or folder) with another user via email.
 * @param shareItemData.itemId - The ID of the item to share.
 * @param shareItemData.itemType - The type of the item (e.g., "file" or "folder").
 * @param shareItemData.sharedById - The ID of the user sharing the item.
 * @param shareItemData.shareWithEmail - The email of the user to share the item with.
 * @returns The response data from the API.
 * @throws An error if the API request fails.
 */

export async function fetchSharedContent(
  userId: string,
  folderId: string | null,
  queryParams: { [key: string]: string | string[] | undefined } | null
) {
  try {
    const params = new URLSearchParams({ userId: encodeURIComponent(userId) });

    if (folderId) {
      params.append("folderId", encodeURIComponent(folderId));
    }
    if (queryParams && queryParams.myshared === "true") {
      params.append("shareByMe", "true");
    }

    const response = await fetch(`${BASE_URL}/api/share?${params.toString()}`, {
      next: { revalidate: false, tags: ["shared"] },
    });
    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Fetch Shared Content Error:",
        result.error || result.message
      );
      throw new Error(
        result.error || result.message || "Failed to fetch shared content."
      );
    }

    console.log("Fetch Shared Content Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Fetch Shared Content Error:", error);
    const err = error as Error;
    throw new Error(`Failed to fetch shared content: ${err.message}`);
  }
}

export async function shareItem(
  shareItemData: ShareItemData,
  showToast: (
    type: "loading" | "success" | "error",
    title: string,
    description?: string
  ) => void
) {
  const { itemId, itemType, sharedById, shareWithEmail, accessLevel } =
    shareItemData;

  try {
    const response = await fetch(`${BASE_URL}/api/share/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId,
        itemType,
        sharedById,
        shareWithEmail,
        accessLevel,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Share Item Error:", result.error || result.message);
      showToast(
        "error",
        `Failed to share ${capitalize(itemType)}`,
        `${result.error || result.message}`
      );
      throw new Error(
        result.error || result.message || "Failed to share item."
      );
    }

    // show success toast
    showToast("success", `${capitalize(itemType)} Shared successfully`, "");

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");
    await revalidateTagHandler("starred");
    await revalidateTagHandler("shared");

    console.log("Share Item Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Share Item Error:", error);
    const err = error as Error;
    throw new Error(`Failed to share ${itemType}: ${err.message}`);
  }
}

export async function removeFromShared({
  userId,
  itemId,
  itemType,
}: {
  userId: string;
  itemId: string;
  itemType: string;
}) {
  try {
    const response = await fetch(`${BASE_URL}/api/share/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, itemId, itemType }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Remove from Shared Error:",
        result.error || result.message
      );
      throw new Error(
        result.error || result.message || "Failed to remove item from shared."
      );
    }

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");
    await revalidateTagHandler("starred");
    await revalidateTagHandler("shared");
    console.log("Remove from Shared Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Remove from Shared Error:", error);
    const err = error as Error;
    throw new Error(`Failed to remove from shared: ${err.message}`);
  }
}

export async function getSharedFile(userId: string, itemId: string) {
  try {
    const params = new URLSearchParams({ userId: encodeURIComponent(userId) });
    const response = await fetch(
      `${BASE_URL}/api/share/${itemId}?${params.toString()}`
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Get Shared File Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to get shared file."
      );
    }

    console.log("Get Shared File Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Get Shared File Error:", error);
    const err = error as Error;
    throw new Error(`Failed to get shared file: ${err.message}`);
  }
}
