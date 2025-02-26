"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import { addToStarred } from "@/lib/services/starred/starredService";
import useUserSession from "@/hooks/useUserSession";
import useClickOutside from "@/hooks/useClickOutside";
import ActionMenu from "./ActionMenu";

interface File {
  id: string;
  file_name: string;
}
interface FileCardProps {
  file: File;
  basePath: string;
}

const FileCard = ({ file, basePath }: FileCardProps) => {
  const pathname = usePathname();
  const session = useUserSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${pathname}?${new URLSearchParams({
    share: "true",
    type: "file",
    id: file?.id,
  })}`;

  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleAddToStarred = async () => {
    try {
      const userId = session?.userId;

      const markItemData = {
        itemType: "file",
        itemId: file?.id,
        userId: userId,
      };

      const addToStarredResponse = await addToStarred(markItemData);
      console.log(addToStarredResponse);
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
      min-h-[45px]
      relative"
    >
      <div className="w-full h-[auto]flex flex-col">
        <div className="w-full h-[45px] flex">
          <div className="h-full aspect-square flex-grow  overflow-hidden flex items-center justify-start">
            <p className="ml-[9%] text-[0.75rem] text-[#1C3553] font-medium truncate whitespace-nowrap">
              {file?.file_name}
            </p>
          </div>
          <div
            className="h-[100%] aspect-square  flex items-center justify-center cursor-pointer"
            onClick={toggleMenu}
          >
            <Icon
              icon="qlementine-icons:menu-dots-16"
              className="w-[40%] h-[40%] text-[#1C3553]"
            />
            {isMenuOpen && (
              <ActionMenu dropdownRef={dropdownRef} isOpen={isMenuOpen} />
            )}
          </div>
        </div>
        <div className="w-full aspect-[2/1.5]  flex items-end justify-center cursor-pointer">
          <div className="w-[90%] h-[100%] bg-[#FFFFFF] rounded-t-[8px]"></div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
