"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";

interface Folder {
  folderId: string;
  folderName: string;
}

interface FolderCardProps {
  folder: Folder;
  basePath: string;
}

const FolderCard = ({ folder, basePath }: FolderCardProps) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const shareUrl = `${pathname}?${new URLSearchParams({
    share: "true",
    type: "folder",
    id: folder.id,
  })}`;

  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-[40px] mx-[1%] my-[15px] flex border border-[#E4E7EC] bg-[#F4F6F6] rounded-[8px]">
      <Link
        href={`${basePath}/folders/${folder.id}`}
        className="h-full flex-1  flex items-center justify-start"
      >
        <div className="h-full aspect-square flex items-center justify-center">
          <Icon
            icon="solar:folder-linear"
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
        </div>
        <div className="h-full flex-1 flex max-w-[100px] items-center overflow-hidden">
          <p className="text-[#1C3553] text-[0.75rem] font-medium  whitespace-nowrap truncate">
            {folder.folder_name}
          </p>
        </div>
      </Link>
      <div className="h-full aspect-square flex items-center justify-center relative">
        <button
          onClick={toggleMenu}
          type="button"
          className="w-full h-full flex items-center justify-center"
        >
          <Icon
            icon="qlementine-icons:menu-dots-16"
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
        </button>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="w-[150px] h-[auto] flex flex-col absolute top-[46px] -right-[100%] bg-white shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)] px-[0px]"
          >
            <button className="w-full h-[40px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]">
              <p>Rename</p>
            </button>
            <Link
              href={shareUrl}
              className="w-full h-[40px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]"
            >
              <p>Share</p>
            </Link>
            <button className="w-full h-[40px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]">
              <p>Delete</p>
            </button>
            <button className="w-full h-[40px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]">
              <p>Add to Starred</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderCard;
