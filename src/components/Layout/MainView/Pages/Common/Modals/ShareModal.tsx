"use client";
import { useRef, useState } from "react";
import { shareItem } from "@/lib/services/shared/sharedServices";
import useUserSession from "@/hooks/useUserSession";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "@heroui/spinner";
import { getFileExtension } from "@/utils/fileExtensionUtils";

const ShareModal = ({ item, itemType, onClose }) => {
  const [shareWithEmail, setShareWithEmail] = useState<string>(
    "mrtnmickae.jrl@gmail.com"
  );
  const modalRef = useRef(null);
  const key = itemType === "folder" ? "folder_name" : "file_name";

  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const session = useUserSession();

  const handleShare = async () => {
    const itemId = item.id;
    const userId = session?.userId;

    console.log(" itemId:", itemId);
    console.log(" itemType:", itemType);
    console.log(" userId:", userId);

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
      console.log(item);
      const shareItemResponse = await shareItem(shareItemData);
      setSuccessMessage("Item shared successfully!");
      if (shareItemResponse && shareItemResponse.error) {
        console.log(shareItemResponse.error);
        throw new Error(shareItemResponse.error);
      }
      setError(null);
      setSuccessMessage(true);
      onClose();
    } catch (error) {
      console.error("Error sharing item:", error.message);
      setError(error.message || "Failed to share item.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div
      ref={modalRef}
      className="w-[250px] h-auto  p-[10px]
    absolute top-1/2 left-1/2 transform -translate-x-[100%] -translate-y-1/2 
    bg-white border rounded-[8px] shadow-[rgba(50,50,93,0.25)_0px_50px_100px_-20px,rgba(0,0,0,0.3)_0px_30px_60px_-30px] z-[50]"
    >
      {/* Heading --------------- */}
      <div className="w-full h-[40px] flex items-center justify-between border-b-[1px] border-b-[#D0D5DD] mb-[10px]">
        <p className="text-[1.1rem]  text-[#1C3553]  font-semibold">
          Share {itemType}
        </p>
        <button
          onClick={onClose}
          className="w-[20px] border border-[#D0D5DD] h-[20px] rounded-full bg-[#E7EFFC] flex items-center justify-center"
        >
          <Icon
            icon="iconamoon:close-fill"
            className="w-[60%] h-[60%] text-[#1C3553]"
          />
        </button>
      </div>

      {/* Logo and item name ------------------------ */}
      <div className="w-full h-[40px] flex items-center">
        <div className="h-[80%] aspect-square border rounded bg-[#EAECEB] flex items-center justify-center">
          <Icon
            icon={
              itemType === "folder" ? "solar:folder-linear" : "proicons:file"
            }
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
        </div>
        <div className="h-full flex-grow flex flex-col justify-center">
          <p className="text-[0.8rem] ml-[15px] italic text-[#1C3553] font-medium">
            {item && item[key]}
          </p>
          {itemType === "file" && (
            <p className="text-[0.8rem] ml-[15px] italic text-[#A2A8B2] font-medium underline">
              {item && itemType === "file" && getFileExtension(item)}
            </p>
          )}
        </div>
      </div>

      {/* Input Group ----------------------------- */}
      <div className="w-full h-auto flex flex-col mt-[5px]">
        <div className="w-full h-[30px] flex items-center">
          <p className="text-[0.8rem]  text-[#A2A8B2]  font-medium">
            Enter email
          </p>
        </div>
        <div className="w-full h-[40px]">
          <input
            value={shareWithEmail}
            onChange={(e) => setShareWithEmail(e.target.value)}
            className="w-full h-full border border-[#D0D5DD] rounded-[5px] outline-none text-[0.8rem]  text-[#1C3553]  font-medium px-[5px]"
          />
        </div>
        <div className="w-full h-[30px] flex items-center justify-start">
          <p className="text-[0.7rem] text-red-700 ml-[2px] font-medium">
            {error}
          </p>
        </div>
      </div>
      {/* Share button --------------------------------------*/}
      <div className="w-full h-[50px] flex items-center justify-end">
        <button
          type="button"
          onClick={handleShare}
          className="w-[80px] h-[30px] px-[15px] rounded text-[0.8rem]  text-[#1C3553]  font-medium bg-[#E7EFFC] border"
        >
          {isSharing ? (
            <Spinner variant="gradient" color="default" size="sm" />
          ) : (
            "Share"
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
