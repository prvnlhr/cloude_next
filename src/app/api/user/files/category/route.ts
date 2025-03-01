import { createClient } from "@/middlewares/supabase/server";
import { getFileExtensionsByCategory } from "@/utils/categoryUtils";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");
    console.log(" userId:", userId);
    console.log(" category:", category);

    if (!userId) {
      return new Response(JSON.stringify({ error: "UserId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!category) {
      return new Response(JSON.stringify({ error: "Category is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const fileExtensions = getFileExtensionsByCategory(category);

    const fileExtensionsWithDots = fileExtensions.map((ext) =>
      ext.startsWith(".") ? ext.trim() : `.${ext.trim()}`
    );

    const supabase = await createClient();

    const { data: files, error } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", userId)
      .in("extension", fileExtensionsWithDots)
      .order("created_at", { ascending: false });
    if (error) throw error;

    return new Response(JSON.stringify({ files }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
