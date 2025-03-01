const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function fetchFilesByCategories(userId: string, category: string) {
  try {
    if (!userId || !category) {
      throw new Error("User ID and at category not present");
    }

    const params = new URLSearchParams();
    params.append("userId", userId);
    params.append("category", category);

    const response = await fetch(
      `${BASE_URL}/api/user/files/category?${params.toString()}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error occurred");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch files:", error);
    throw new Error(`Failed to fetch files: ${error.message}`);
  }
}
