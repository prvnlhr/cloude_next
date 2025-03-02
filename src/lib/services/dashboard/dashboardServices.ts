const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function fetchDashboardContent(userId) {
  try {
    const params = new URLSearchParams({ userId: encodeURIComponent(userId) });

    const response = await fetch(
      `${BASE_URL}/api/dashboard?${params.toString()}`
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Fetch Dashboard Content Error:",
        result.error || result.message
      );
      throw new Error(
        result.error || result.message || "Failed to fetch dashboard content."
      );
    }

    console.log("Fetch Dashboard Content Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Fetch Dashboard Content Error:", error);
    throw new Error(`Failed to fetch dashboard content: ${error.message}`);
  }
}
