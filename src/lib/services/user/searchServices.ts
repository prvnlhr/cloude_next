const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function searchItem(userId, searchKey) {
  console.log("userId, searchKey:", userId, searchKey);
  try {
    const params = new URLSearchParams({
      searchKey: encodeURIComponent(searchKey),
      userId: encodeURIComponent(userId),
    });

    const response = await fetch(
      `${BASE_URL}/api/user/search?${params.toString()}`
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Search Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to fetch search results"
      );
    }

    console.log("Search Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Search Error:", error);
    throw new Error(`Failed to fetch search results: ${error.message}`);
  }
}
