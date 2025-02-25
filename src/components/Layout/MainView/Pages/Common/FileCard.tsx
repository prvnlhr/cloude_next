"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
interface File {
  fileId: string;
  fileName: string;
}
interface FileCardProps {
  file: File;
  basePath: string;
}

const FileCard = ({ file, basePath }: FileCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const shareUrl = `${pathname}?${new URLSearchParams({
    share: "true",
    type: "file",
    id: file.id,
  })}`;

  console.log(file);
  const toggleMenu = (event: React.MouseEvent) => {
    console.log("toggle...");
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
    <div className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-auto mx-[1%] my-[15px] bg-[#F4F6F6] border-[1px] border-[#E4E7EC] flex flex-col rounded-[10px]">
      <div className="w-full h-[40px] flex pl-[10%] relative z-0">
        <div className="flex-1 h-full flex items-center justify-start overflow-hidden">
          <p className="text-[0.75rem] text-[#1C3553] font-medium truncate whitespace-nowrap">
            {file.file_name}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleMenu}
          className="h-full aspect-square flex items-center justify-center"
        >
          <Icon
            icon="qlementine-icons:menu-dots-16"
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
        </button>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="w-[150px] h-[auto] flex flex-col absolute top-[46px] -right-[100%] bg-white shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)] px-[0px] z-10"
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
      <Link
        href={`${basePath}/files/${file.id}`}
        className="w-full aspect-[3/2] flex justify-center items-end"
      >
        <div className="w-[80%] h-[100%] bg-[#FFFFFF] flex items-center  justify-center">
          Image
        </div>
      </Link>
    </div>
  );
};

export default FileCard;
