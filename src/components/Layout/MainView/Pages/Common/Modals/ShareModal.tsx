"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/middlewares/supabase/client";
import { shareItem } from "@/lib/services/shared/sharedServices";
import useUserSession from "@/hooks/useUserSession";

const ShareModal = () => {
  const searchParams = useSearchParams();
  const [shareWithEmail, setShareWithEmail] = useState<string>(
    "mrtnmickae.jrl@gmail.com"
  );
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const session = useUserSession();

  const handleShare = async () => {
    const itemId = searchParams.get("id");
    const itemType = searchParams.get("type");
    const userId = session?.userId;

    if (!itemId || !itemType || !userId) {
      setError("Missing required data for sharing.");
      return;
    }

    const shareItemData = {
      itemId,
      itemType,
      sharedById: userId,
      shareWithEmail,
    };

    setIsSharing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const shareItemResponse = await shareItem(shareItemData);
      setSuccessMessage("Item shared successfully!");
      console.log("Share response:", shareItemResponse);
    } catch (error) {
      setError(error.message || "Failed to share item.");
      console.error("Error sharing item:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div>
      <h1>Share Modal</h1>
      <div>
        <label htmlFor="shareWithEmail">Share with:</label>
        <input
          id="shareWithEmail"
          type="email"
          value={shareWithEmail}
          onChange={(e) => setShareWithEmail(e.target.value)}
          placeholder="Enter email address"
        />
      </div>
      <button onClick={handleShare} disabled={isSharing}>
        {isSharing ? "Sharing..." : "Share"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default ShareModal;
