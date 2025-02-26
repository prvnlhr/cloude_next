"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import useUserSession from "@/hooks/useUserSession";
import {
  addToStarred,
  removeFromStarred,
} from "@/lib/services/starred/starredService";

import useClickOutside from "@/hooks/useClickOutside";
import ActionMenu from "./ActionMenu";

interface Folder {
  id: string;
  folder_name: string;
}

interface FolderCardProps {
  folder: Folder;
  basePath: string;
}

const FolderCard = ({ folder, basePath }: FolderCardProps) => {
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const session = useUserSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const shareUrl = `${pathname}?${new URLSearchParams({
    share: "true",
    type: "folder",
    id: folder?.id,
  })}`;

  const toggleActionMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleMarkStar = async () => {
    try {
      const userId = session?.userId;
      const markItemData = {
        itemType: "folder",
        itemId: folder?.id,
        userId: userId,
      };
      const markStarResponse = await addToStarred(markItemData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveStar = async () => {
    try {
      const itemId = folder?.id;
      const userId = session?.userId;
      const itemType = "folder";
      const removeResponse = await removeFromStarred(itemId, itemType, userId);
    } catch (error) {
      console.log(error);
    }
  };

  useClickOutside(dropdownRef, () => setIsMenuOpen(false));

  return (
    <div
      className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-auto 
      mx-[1%] my-[15px] 
      bg-[#EAECEB] border-[1px] border-[#E4E7EC] 
      flex flex-col 
      rounded-[10px]
      min-h-[40px]
      relative
      z-[4]
      cursor-pointer
      "
    >
      <div className="w-full h-[40px]  flex">
        <div className="h-full aspect-square  flex items-center justify-center">
          <Icon
            icon="solar:folder-linear"
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
        </div>
        <div className="h-full aspect-square flex-grow flex items-center justify-start overflow-hidden">
          <p className="text-[#1C3553] text-[0.75rem] font-medium  whitespace-nowrap truncate">
            {folder?.folder_name}
          </p>
        </div>
        <div
          className="h-full aspect-square flex items-center justify-center cursor-pointer"
          onClick={toggleActionMenu}
        >
          <Icon
            icon="qlementine-icons:menu-dots-16"
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
          {isMenuOpen && (
            <ActionMenu dropdownRef={dropdownRef} isOpen={isMenuOpen} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
