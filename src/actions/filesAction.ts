"use server";

import { createClient } from "@/middlewares/supabase/server";

const signedUrlCache = new Map<string, { url: string; expiresAt: number }>();

export const getSignedUrl = async (
  filePath: string
): Promise<string | null> => {
  const now = Date.now();

  if (signedUrlCache.has(filePath)) {
    const cachedData = signedUrlCache.get(filePath);
    if (cachedData && cachedData.expiresAt > now) {
      return cachedData.url;
    }
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("cloude")
      .createSignedUrl(filePath, 3600);

    if (error || !data?.signedUrl) {
      console.error(
        "Error generating signed URL:",
        error?.message || "Unknown error"
      );
      return null;
    }

    signedUrlCache.set(filePath, {
      url: data.signedUrl,
      expiresAt: now + 3600 * 1000,
    });

    return data.signedUrl;
  } catch (err) {
    console.error("Unexpected error in getSignedUrl:", err);
    return null;
  }
};
