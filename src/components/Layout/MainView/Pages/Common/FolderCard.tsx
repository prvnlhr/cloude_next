"use client";
import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import { File, Folder } from "@/types/contentTypes";
import useClickOutside from "@/hooks/useClickOutside";
import ActionMenu from "./ActionMenu";
import Link from "next/link";
import { formatDate } from "@/utils/contentUtils";

interface FolderCardProps {
  folder: Folder;
  setActiveModal: (modal: {
    value: string;
    item: File | Folder | undefined;
    type: string;
  }) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, setActiveModal }) => {
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  console.log(folder);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleActionMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  useClickOutside(dropdownRef, () => setIsMenuOpen(false));

  return (
    <div
      className="w-[45%] sm:w-[45%] md:w-[30%] lg:w-[18%] h-auto 
      flex flex-col items-center bg-white 
      p-[6px] my-[15px]
      mx-[2.5%] sm:mx-[2.5%] md:mx-[1.5%] lg:mx-[1%]
      rounded-[10px]
      shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
      hover:shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]
      relative
      "
    >
      <div className="w-full h-[40px] flex items-start justify-start rounded-[10px]">
        <div
          className="h-full aspect-square bg-[#F7F7F7] flex items-center justify-center"
          style={{
            borderRadius: "inherit",
          }}
        >
          {/* 5B8DF4 */}
          {/* 5B8DF4 */}
          <Icon
            icon="solar:folder-bold"
            className="w-[60%] h-[60%] text-[#5B8DF4]"
          />
        </div>
        <Link
          href={
            pathname.includes("/folders/")
              ? `${pathname.replace(/folders\/[^/]+$/, `folders/${folder.id}`)}`
              : `${pathname}/folders/${folder.id}`
          }
          className="h-full flex-grow min-w-0 flex flex-col justify-center"
        >
          <p className="text-[#1C3553] w-[90%] ml-[10px] text-[0.8rem] font-medium truncate whitespace-nowrap">
            {folder.folder_name}
          </p>
          <p className="text-[#A2A8B2] w-full ml-[10px] text-[0.65rem] font-medium truncate whitespace-nowrap">
            {formatDate(folder.created_at)}
          </p>
        </Link>
        <div className="h-full aspect-[1/1.5] flex-shrink-0 flex items-center justify-center relative">
          <button
            onClick={toggleActionMenu}
            type="button"
            className="w-[100%] aspect-square flex items-center  justify-center bg-[#F2F2F2] border-[#F0F0F0] rounded-full"
          >
            <Icon
              icon="qlementine-icons:menu-dots-16"
              className="w-[70%] h-[70%] text-[#1C3553]"
            />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <ActionMenu
          dropdownRef={dropdownRef}
          item={folder}
          itemType={"folder"}
          setActiveModal={setActiveModal}
        />
      )}
    </div>
  );
};

export default FolderCard;
