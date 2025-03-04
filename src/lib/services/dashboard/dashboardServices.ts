import { DashboardContent } from "@/types/dashboardTypes";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "https://cloude-next.vercel.app";

export async function fetchDashboardContent(
  userId: string
): Promise<DashboardContent> {
  try {
    const params = new URLSearchParams({ userId: encodeURIComponent(userId) });

    const response = await fetch(
      `${BASE_URL}/api/dashboard?${params.toString()}`,
      { next: { revalidate: false, tags: ["dashboard"] } }
    );
    const result = await response.json();

    if (!response.ok) {
      console.log("result", result);
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
    if (error instanceof Error) {
      throw new Error(`Failed to fetch dashboard content: ${error.message}`);
    } else {
      throw new Error("Failed to fetch dashboard content: Unknown error");
    }
  }
}
