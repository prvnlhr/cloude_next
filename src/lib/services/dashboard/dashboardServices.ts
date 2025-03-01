const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function fetchDashboardContent(userId) {
  try {
    console.log(userId);
    const params = new URLSearchParams({ userId: encodeURIComponent(userId) });

    const response = await fetch(
      `${BASE_URL}/api/dashboard?${params.toString()}`
    );

    if (!response.ok) {
      const responseData = await response.json();
      throw {
        status: response.status,
        message:
          responseData.error ||
          responseData.message ||
          "Failed to fetch dashboard content.",
        data: responseData,
      };
    }

    return await response.json();
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Network error or server unreachable",
      data: error.data || null,
    };
  }
}

