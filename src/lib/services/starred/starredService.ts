import { revalidateTagHandler } from "@/lib/revalidation";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function fetchStarredContent(userId, folderId) {
  try {
    const params = new URLSearchParams({ userId: encodeURIComponent(userId) });

    if (folderId) {
      params.append("folderId", encodeURIComponent(folderId));
    }

    const response = await fetch(`${BASE_URL}/api/star?${params.toString()}`, {
      next: { revalidate: false, tags: ["starred"] },
    });
    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Fetch Starred Content Error:",
        result.error || result.message
      );
      throw new Error(
        result.error || result.message || "Failed to fetch starred content."
      );
    }

    console.log("Fetch Starred Content Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Fetch Starred Content Error:", error);
    throw new Error(`Failed to fetch starred content: ${error.message}`);
  }
}

export async function addToStarred(starData) {
  const { itemId, itemType, userId } = starData;

  if (!itemId || !userId) {
    throw new Error("Both itemId and userId are required.");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/star/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId, itemType, userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Add to Starred Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to add item to starred."
      );
    }

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");
    await revalidateTagHandler("starred");

    console.log("Add to Starred Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Add to Starred Error:", error);
    throw new Error(`Failed to add to starred: ${error.message}`);
  }
}

export async function removeFromStarred(starData) {
  const { itemId, itemType, userId } = starData;

  if (!itemId || !userId) {
    throw new Error("Both itemId and userId are required.");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/star/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId, itemType, userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Remove from Starred Error:",
        result.error || result.message
      );
      throw new Error(
        result.error || result.message || "Failed to remove item from starred."
      );
    }

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");
    await revalidateTagHandler("starred");

    console.log("Remove from Starred Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Remove from Starred Error:", error);
    throw new Error(`Failed to remove from starred: ${error.message}`);
  }
}
