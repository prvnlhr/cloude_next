"use client";
import { useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";

import useClickOutside from "@/hooks/useClickOutside";
import ActionMenu from "./ActionMenu";
import Link from "next/link";

interface Folder {
  id: string;
  folder_name: string;
}

interface FolderCardProps {
  folder: Folder;
  basePath: string;
}

const FolderCard = ({ folder, setActiveModal }: FolderCardProps) => {
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
      bg-[#EAECEB] border-[1px] border-[#E4E7EC] 
      flex flex-col 
      rounded-[10px]
      min-h-[40px]
      relative
      z-[4]
      cursor-pointer
      shadow-[0px_0px_0px_1px_rgba(0,0,0,0.05)]
      
      "
    >
      <div className="w-full h-[40px] flex">
        <Link
          href={
            pathname.includes("/folders/")
              ? `${pathname.replace(/folders\/[^/]+$/, `folders/${folder.id}`)}`
              : `${pathname}/folders/${folder.id}`
          }
          className="w-full h-full flex"
        >
          <div className="h-full aspect-square flex items-center justify-center">
            <Icon
              icon="solar:folder-linear"
              className="w-[50%] h-[50%] text-[#1C3553]"
            />
          </div>
          <div className="h-full flex-grow flex items-center justify-start overflow-hidden">
            <p className="text-[#1C3553] text-[0.75rem] font-medium  whitespace-nowrap truncate">
              {folder?.folder_name}
            </p>
          </div>
        </Link>
        <div
          className="h-full aspect-square flex items-center justify-center cursor-pointer"
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
