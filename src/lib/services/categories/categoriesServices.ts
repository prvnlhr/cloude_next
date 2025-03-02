const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function fetchFilesByCategories(userId, category) {
  try {
    if (!userId || !category) {
      throw new Error("User ID and category are required.");
    }

    const params = new URLSearchParams({
      userId: encodeURIComponent(userId),
      category_name: encodeURIComponent(category),
    });

    const response = await fetch(
      `${BASE_URL}/api/user/files/category?${params.toString()}`
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Fetch Files by Category Error:",
        result.error || result.message
      );
      throw new Error(
        result.error || result.message || "Failed to fetch files by category."
      );
    }

    console.log("Fetch Files by Category Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Fetch Files by Category Error:", error);
    throw new Error(`Failed to fetch files by category: ${error.message}`);
  }
}
