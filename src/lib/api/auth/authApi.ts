const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function logoutUser() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signout`, {
      method: "POST",
    });
    console.log(await response.json());
    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Sign-out failed:", errorMessage);
      throw new Error(errorMessage.message || "Sign-out failed");
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Sign-out error:", error);
    throw new Error(`${error}`);
  }
}
