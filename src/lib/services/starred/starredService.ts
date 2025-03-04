import { revalidateTagHandler } from "@/lib/revalidation";
import { capitalize } from "../shared/sharedServices";
const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "https://cloude-next.vercel.app";

type StarData = {
  itemId: string;
  itemType: string;
  userId: string;
  itemOwnerId: string;
  accessLevel: string;
};

export async function fetchStarredContent(
  userId: string,
  folderId: string | null
) {
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
    const err = error as Error;
    throw new Error(`Failed to fetch starred content: ${err.message}`);
  }
}

export async function addToStarred(
  starData: StarData,
  showToast: (
    type: "loading" | "success" | "error",
    title: string,
    description?: string,
    toastId?: string | number
  ) => string | number
) {
  const { itemId, itemType, userId, itemOwnerId, accessLevel } = starData;

  if (!itemId || !userId) {
    throw new Error("Both itemId and userId are required.");
  }

  const toastId = showToast(
    "loading",
    `Adding ${capitalize(starData.itemType)} to Starred`,
    ``
  );

  try {
    const response = await fetch(`${BASE_URL}/api/star/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId,
        itemType,
        userId,
        itemOwnerId,
        accessLevel,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Add to Starred Error:", result.error || result.message);
      showToast(
        "error",
        `Adding ${capitalize(starData.itemType)} to starred failed`,
        `${result.error || result.message}`,
        toastId
      );
      throw new Error(
        result.error || result.message || "Failed to add item to starred."
      );
    }

    // show success toast
    showToast(
      "success",
      `${capitalize(starData.itemType)} added to starred`,
      ``,
      toastId
    );

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");
    await revalidateTagHandler("starred");
    await revalidateTagHandler("shared");

    console.log("Add to Starred Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Add to Starred Error:", error);
    const err = error as Error;
    throw new Error(`Failed to add to starred: ${err.message}`);
  }
}

export async function removeFromStarred(
  starData: StarData,
  showToast: (
    type: "loading" | "success" | "error",
    title: string,
    description?: string,
    toastId?: string | number
  ) => string | number
) {
  const { itemId, itemType, userId, itemOwnerId } = starData;

  if (!itemId || !userId) {
    throw new Error("Both itemId and userId are required.");
  }
  const toastId = showToast(
    "loading",
    `Removing ${capitalize(starData.itemType)} from Starred`,
    ``
  );
  try {
    const response = await fetch(`${BASE_URL}/api/star/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId, itemType, userId, itemOwnerId }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Remove from Starred Error:",
        result.error || result.message
      );
      showToast(
        "error",
        `Removing ${capitalize(starData.itemType)} from starred failed`,
        `${result.error || result.message}`,
        toastId
      );
      throw new Error(
        result.error || result.message || "Failed to remove item from starred."
      );
    }

    showToast(
      "success",
      `${capitalize(starData.itemType)} removed from starred`,
      ``,
      toastId
    );

    await revalidateTagHandler("storage");
    await revalidateTagHandler("dashboard");
    await revalidateTagHandler("starred");
    await revalidateTagHandler("shared");
    // show success toast

    console.log("Remove from Starred Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Remove from Starred Error:", error);
    const err = error as Error;
    throw new Error(`Failed to remove from starred: ${err.message}`);
  }
}
