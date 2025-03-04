"use client";
import { useRef, useState } from "react";
import { shareItem } from "@/lib/services/shared/sharedServices";
import useUserSession from "@/hooks/useUserSession";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "@heroui/spinner";
import { getFileExtension } from "@/utils/fileExtensionUtils";
import { useToast } from "@/context/ToastContext";

interface ShareModalProps {
  item: File | Folder | undefined;
  itemType: string;
  onClose: () => void;
}
const accessLevelMap = {
  READ: "Read-Only",
  WRITE: "Write Access",
  FULL: "Full Access",
};
const accessLevelsData = [
  {
    key: "FULL",
    title: accessLevelMap.FULL,
    description: "Can read, edit, share, and delete",
  },
  {
    key: "WRITE",
    title: accessLevelMap.WRITE,
    description: "Can read and edit",
  },
  {
    key: "READ",
    title: accessLevelMap.READ,
    description: "Can view only",
  },
];
const ShareModal: React.FC<ShareModalProps> = ({ item, itemType, onClose }) => {
  const [shareWithEmail, setShareWithEmail] = useState<string>(
    "mrtnmickae.jrl@gmail.com"
  );
  const modalRef = useRef(null);
  const key = itemType === "folder" ? "folder_name" : "file_name";

  const [showAccessLevels, setShowAccessLevels] = useState(false);
  const [accessLevel, setAccessLevel] = useState("READ");

  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { showToast } = useToast();
  const session = useUserSession();

  const handleShare = async () => {
    const itemId = item.id;
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
      accessLevel,
    };

    setIsSharing(true);
    setError(null);
    setSuccessMessage(null);
    try {
      console.log(item);
      const shareItemResponse = await shareItem(shareItemData, showToast);
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
      className="
      w-[280px] h-auto  p-[10px]
      absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
    bg-white border rounded-[8px] shadow-[rgba(50,50,93,0.25)_0px_50px_100px_-20px,rgba(0,0,0,0.3)_0px_30px_60px_-30px] z-[50]
        lg:-translate-x-full"
    >
      {/* Heading --------------- */}
      <div className="w-full h-[40px] flex items-center justify-between border-b-[1px] border-b-[#EFEFEF] mb-[10px]">
        <p className="text-[1.1rem]  text-[#1C3553]  font-semibold">
          Share {itemType}
        </p>
        <button
          onClick={onClose}
          className="w-[25px] h-[25px] border border-[#EFEFEF]  rounded-full bg-[#E7EFFC] flex items-center justify-center"
        >
          <Icon
            icon="iconamoon:close-fill"
            className="w-[60%] h-[60%] text-[#1C3553]"
          />
        </button>
      </div>

      {/* Logo and item name ------------------------ */}
      <div className="w-full h-[40px] flex items-center">
        <div className="h-[80%] aspect-square border rounded bg-[#F6F6F6] flex items-center justify-center">
          <Icon
            icon={
              itemType === "folder" ? "solar:folder-linear" : "proicons:file"
            }
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
        </div>
        <div className="h-full flex-grow flex flex-col justify-center overflow-hidden">
          <p className="text-[0.8rem] ml-[15px] italic text-[#1C3553] font-medium truncate whitespace-nowrap">
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
            className="w-full h-full border border-[#EFEFEF] rounded-[5px] outline-none text-[0.8rem]  text-[#1C3553]  font-medium px-[5px]"
          />
        </div>
        <div className="w-full h-[30px] flex items-center justify-start">
          <p className="text-[0.7rem] text-red-700 ml-[2px] font-medium">
            {error}
          </p>
        </div>
      </div>
      {/* Share button --------------------------------------*/}
      <div className="w-full h-[50px] flex items-center justify-between">
        <div className="w-[65%] h-full flex items-center justify-center relative mr-[2%]">
          <div className="w-[calc(100%-20px)] h-[100%] border outline-none rounded px-[10px] text-[0.8rem] font-medium text-[#1C3553] flex items-center">
            {accessLevelMap[accessLevel]}
          </div>
          <div
            className="h-full w-[20px] flex items-center  justify-center cursor-pointer"
            onClick={() => setShowAccessLevels((prev) => !prev)}
          >
            <Icon
              icon="lucide:chevron-down"
              className="w-[100%] h-[100%] text-[black]"
            />
          </div>

          {showAccessLevels && (
            <div
              className="
            absolute w-[200px] h-auto flex flex-col 
            bottom-[50px] bg-white p-[10px] 
            shadow-[rgba(50,50,93,0.25)_0px_50px_100px_-20px,rgba(0,0,0,0.3)_0px_30px_60px_-30px] 
            rounded border"
            >
              {accessLevelsData.map((level) => (
                <div
                  key={level.key}
                  className="w-full h-[60px] text-[0.8rem] text-[#1C3553] font-medium flex flex-col justify-center hover:bg-[#F6F6F6] px-[8px] rounded"
                  onClick={() => {
                    setAccessLevel(level.key);
                    setShowAccessLevels(false);
                  }}
                >
                  <p className="font-semibold">{level.title}</p>
                  <p className="text-gray-600">{level.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="w-[30%] h-[30px] px-[15px] flex items-center justify-center rounded text-[0.8rem]  text-[#1C3553] font-medium bg-[#E7EFFC] border"
        >
          {isSharing ? (
            <Spinner variant="gradient" color="primary" size="sm" />
          ) : (
            "Share"
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
