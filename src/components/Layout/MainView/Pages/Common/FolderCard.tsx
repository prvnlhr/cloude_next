"use client";
import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import { File, Folder } from "@/types/contentTypes";
import useClickOutside from "@/hooks/useClickOutside";
import ActionMenu from "./ActionMenu";
import Link from "next/link";

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleActionMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  useClickOutside(dropdownRef, () => setIsMenuOpen(false));

  return (
    <div
      className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-auto 
      mx-[1%] my-[15px] 
      bg-[#F6F6F6] border-[1px] border-[#E4E7EC] 
      flex
      justify-between  
      rounded-[10px]
      min-h-[40px]
      relative
      z-[4]
      cursor-pointer
      shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
      "
    >
      <div className="w-full h-[40px] flex justify-between">
        <Link
          href={
            pathname.includes("/folders/")
              ? `${pathname.replace(/folders\/[^/]+$/, `folders/${folder.id}`)}`
              : `${pathname}/folders/${folder.id}`
          }
          className="w-auto h-full flex overflow-hidden"
        >
          <div className="h-full  w-[40px] min-w-[40px] flex items-center justify-center">
            <Icon
              icon="solar:folder-linear"
              className="w-[50%] h-[50%] text-[#1C3553]"
            />
          </div>
          <div className="h-full flex-grow flex items-center justify-start overflow-hidden">
            <p className="text-[0.85rem] sm:text-[0.85rem] md:text-[0.9rem] lg:text-[0.9rem] text-[#1C3553] font-medium truncate whitespace-nowrap">
              {folder.folder_name}
            </p>
          </div>
        </Link>
        <div
          className="h-full w-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
          onClick={toggleActionMenu}
        >
          <Icon
            icon="qlementine-icons:menu-dots-16"
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
          {isMenuOpen && (
            <ActionMenu
              dropdownRef={dropdownRef}
              item={folder}
              itemType={"folder"}
              setActiveModal={setActiveModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
