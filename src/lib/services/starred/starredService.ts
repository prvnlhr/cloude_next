import { revalidateTagHandler } from "@/lib/revalidation";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function addToStarred(markItemData) {
  try {
    const response = await fetch(`${BASE_URL}/api/starred/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: markItemData.itemId,
        itemType: markItemData.itemType,
        userId: markItemData.userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add item to star.");
    }

    await revalidateTagHandler("starred");
    await revalidateTagHandler("storage");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding to starred:", error);
    throw new Error(`Failed to add to starred: ${error.message}`);
  }
}

export async function getStarredContent(userId, folderId) {
  try {
    const params = new URLSearchParams({ userId: encodeURIComponent(userId) });

    if (folderId) {
      // If folder id, that means we want data of subfolder
      params.append("folderId", encodeURIComponent(folderId));
    }

    const response = await fetch(
      `${BASE_URL}/api/starred?${params.toString()}`,
      { next: { tags: ["starred"] } }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error occurred");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get starred content:", error);
    throw new Error(`Failed to get starred content: ${error.message}`);
  }
}

export async function removeFromStarred(itemId, itemType, userId) {
  console.log("Removing from starred - userId:", userId, "itemId:", itemId);

  // Validate input
  if (!itemId || !userId) {
    throw new Error("Both itemId and userId are required.");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/starred/${itemId}`, {
      method: "DELETE", // Use DELETE for removal
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        itemType: itemType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to remove item from starred."
      );
    }
    await revalidateTagHandler("starred");
    await revalidateTagHandler("storage");
    const data = await response.json();
    console.log("Item removed from starred successfully:", data);
    return data;
  } catch (error) {
    console.error("Error removing from starred:", error);
    throw new Error(`Failed to remove from starred: ${error.message}`);
  }
}
