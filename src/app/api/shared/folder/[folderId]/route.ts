import { createClient } from "@/middlewares/supabase/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const itemId = formData.get("itemId");
    const itemType = formData.get("itemType");
    const userId = formData.get("userId");
    const shareWithEmail = formData.get("shareWithEmail");

    const supabase = await createClient();

    const { data: shareWithUser, error: shareWithError } = await supabase
      .from("users")
      .select("user_id")
      .eq("email", shareWithEmail)
      .limit(1)
      .single();

    if (shareWithError || !shareWithUser) {
      return new Response(
        JSON.stringify({
          error: "User not found",
          message: "User with this email does not exist.",
        }),
        { status: 404 }
      );
    }

    const shareWithUserId = shareWithUser.user_id;

    const { data: existingShare, error: existingShareError } = await supabase
      .from("share")
      .select("id")
      .eq("item_id", itemId)
      .eq("item_type", itemType)
      .eq("share_with", shareWithUserId)
      .limit(1)
      .single();

    if (existingShare) {
      return new Response(
        JSON.stringify({
          message: "Item is already shared with this user.",
        }),
        { status: 409 }
      );
    }

    if (existingShareError && existingShareError.code !== "PGRST116") {
      return new Response(
        JSON.stringify({
          error: existingShareError,
          message: "Error checking existing share.",
        }),
        { status: 500 }
      );
    }

    const { data: newShare, error: shareError } = await supabase
      .from("share")
      .insert({
        item_id: itemId,
        item_type: itemType,
        share_by: userId,
        share_with: shareWithUserId,
        is_starred: false,
      })
      .select("*")
      .single();

    if (shareError) {
      return new Response(
        JSON.stringify({
          error: shareError,
          message: "Error sharing the item.",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Item shared successfully.",
        data: newShare,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: error.message,
        message: "Error at Share file POST",
      }),
      { status: 500 }
    );
  }
}
