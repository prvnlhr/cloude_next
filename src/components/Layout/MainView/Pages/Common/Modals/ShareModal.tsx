"use client";
import { useRef, useState } from "react";
import { shareItem } from "@/lib/services/shared/sharedServices";
import useUserSession from "@/hooks/useUserSession";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "@heroui/spinner";
import { useToast } from "@/context/ToastContext";
import { File, Folder } from "@/types/contentTypes";
import { getFileExtension } from "@/utils/categoryUtils";

interface ShareModalProps {
  item: File | Folder | undefined;
  itemType: string;
  onClose: () => void;
}

type AccessLevel = "READ" | "WRITE" | "FULL";

const accessLevelMap: Record<AccessLevel, string> = {
  READ: "Read-Only",
  WRITE: "Write Access",
  FULL: "Full Access",
};

const accessLevelsData = [
  {
    key: "FULL" as AccessLevel,
    title: accessLevelMap.FULL,
    description: "Can read, edit, share, and delete",
  },
  {
    key: "WRITE" as AccessLevel,
    title: accessLevelMap.WRITE,
    description: "Can read and edit",
  },
  {
    key: "READ" as AccessLevel,
    title: accessLevelMap.READ,
    description: "Can view only",
  },
];

const ShareModal: React.FC<ShareModalProps> = ({ item, itemType, onClose }) => {
  const [shareWithEmail, setShareWithEmail] = useState<string>("");
  const modalRef = useRef(null);

  const [showAccessLevels, setShowAccessLevels] = useState(false);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("READ");

  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const session = useUserSession();

  const handleShare = async () => {
    const itemId = item?.id;
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
    try {
      const shareItemResponse = await shareItem(shareItemData, showToast);
      if (shareItemResponse && shareItemResponse.error) {
        console.log(shareItemResponse.error);
        throw new Error(shareItemResponse.error);
      }
      setError(null);
      onClose();
    } catch (error) {
      console.error("Error sharing item:", error);

      // Type guard to check if `error` is an instance of `Error`
      if (error instanceof Error) {
        setError(error.message || "Failed to share item.");
      } else {
        setError("Failed to share item.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const itemName = item
    ? itemType === "folder"
      ? (item as Folder).folder_name
      : (item as File).file_name
    : "Unnamed Item";

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
      <div className="w-full h-[50px] flex items-center">
        <div className="h-[80%] aspect-square rounded-[10px] bg-[#F7F7F7] flex items-center justify-center">
          <Icon
            icon={itemType === "folder" ? "solar:folder-bold" : "proicons:file"}
            className="w-[50%] h-[50%] text-[#5B8DF4]"
          />
        </div>
        <div className="h-full flex-grow flex flex-col justify-center overflow-hidden">
          <p className="text-[0.9rem] w-[85%] ml-[15px]  text-[#1C3553] font-medium truncate whitespace-nowrap">
            {itemName}
          </p>
          {itemType === "file" && (
            <p className="text-[0.8rem] ml-[15px] italic text-[#A2A8B2] font-medium underline">
              {item && itemType === "file" && getFileExtension(itemName)}
            </p>
          )}
        </div>
      </div>

      {/* Input Group ----------------------------- */}
      <div className="w-full h-auto flex flex-col mt-[5px]">
        <div className="w-full h-[30px] flex items-center">
          <p className="text-[0.8rem]  text-[#A2A8B2] font-medium ml-[2px]">
            Enter an email address to share with
          </p>
        </div>
        <div className="w-full h-[40px]">
          <input
            value={shareWithEmail}
            onChange={(e) => setShareWithEmail(e.target.value)}
            className="w-full h-full border border-[#EFEFEF] rounded-[5px] outline-none text-[0.8rem]  text-[#1C3553]  font-medium px-[5px]"
          />
        </div>
        {error && (
          <div className="w-full h-[30px] my-[5px] flex items-center justify-start">
            <p className="text-[0.7rem] text-red-700 ml-[2px] font-semibold">
              {error}
            </p>
          </div>
        )}
      </div>
      {/* Footer --------------------------------------*/}
      <div className="w-full h-[50px] flex items-center justify-between">
        {/* Access level selector ---------------- */}
        <div className="w-[48%] h-[80%] flex items-center justify-center relative mr-[2%]">
          <div className="w-[calc(100%-20px)] h-[100%] border outline-none rounded px-[10px] text-[0.8rem] font-semibold text-[#4B74D7] flex items-center">
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

        {/* Share button -------------------------- */}
        <button
          type="button"
          onClick={handleShare}
          className="w-[45%] h-[30px] px-[15px] flex items-center justify-center rounded  bg-[#E7EFFC]"
        >
          {isSharing ? (
            <>
              <Spinner
                variant="default"
                color="primary"
                size="sm"
                classNames={{
                  wrapper: "w-[15px] h-[15px] flex item-center justify-center",
                }}
              />
              <p className="text-[0.8rem] text-[#4B74D7] font-medium ml-[10px]">
                Sharing...
              </p>
            </>
          ) : (
            <p className="text-[0.8rem] text-[#4B74D7] font-medium">Share</p>
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
