"use server";

import { createClient } from "@/middlewares/supabase/server";

export const getSignedUrl = async (filePath: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("cloude")
    .createSignedUrl(filePath, 3600);

  if (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
  return data.signedUrl;
};
