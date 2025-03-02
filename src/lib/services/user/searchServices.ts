const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function searchItem(userId, searchKey) {
  console.log(" userId, searchKey:", userId, searchKey);
  try {
    const params = new URLSearchParams({
      searchKey: encodeURIComponent(searchKey),
    });
    params.append("userId", encodeURIComponent(userId));

    const response = await fetch(
      `${BASE_URL}/api/user/search?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error(`Failed to upload file`);
    }
    const searchResults = await response.json();
    console.log(" searchResults:", searchResults);
    return searchResults;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to upload users files ${error}`);
  }
}
