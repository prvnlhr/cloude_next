"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import { addToStarred } from "@/lib/services/starred/starredService";
import useUserSession from "@/hooks/useUserSession";
import useClickOutside from "@/hooks/useClickOutside";
import ActionMenu from "./ActionMenu";
import { getSignedUrl } from "@/actions/filesAction";
import Image from "next/image";
import { inherits } from "util";
interface File {
  id: string;
  file_name: string;
  storage_path: string;
  file_type: string;
}
interface FileCardProps {
  file: File;
  basePath: string;
}

const FileCard = ({ file, setActiveModal }: FileCardProps) => {
  const pathname = usePathname();
  const session = useUserSession();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const fetchSignedUrl = async () => {
      const url = await getSignedUrl(file.storage_path);
      console.log(url);
      setSignedUrl(url);
    };

    if (file?.storage_path) {
      fetchSignedUrl();
    }
  }, [file?.storage_path]);

  return (
    <div
      className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-auto 
      mx-[1%] my-[15px] 
      bg-[#F4F6F6] border-[1px] border-[#E4E7EC] 
      flex flex-col 
      rounded-[10px]
      min-h-[45px]
      relative
      shadow-[0px_0px_0px_1px_rgba(0,0,0,0.05)]"
    >
      <div className="w-full h-[auto]flex flex-col">
        <Link
          href={
            pathname.includes("/files/")
              ? `${pathname.replace(/files\/[^/]+$/, `files/${file.id}`)}`
              : `${pathname}/files/${file.id}`
          }
          className="w-full aspect-[2/1.5] flex items-end justify-center cursor-pointer overflow-hidden p-[8px]"
        >
          <div
            className="w-[100%] h-[100%] bg-[#FFFFFF] object-contain
            flex items-center justify-center overflow-hidden relative rounded"
          >
            {signedUrl && file.file_type === "image/jpeg" ? (
              <Image
                src={signedUrl || "/"}
                fill={true}
                quality={20}
                alt={file.file_name}
              />
            ) : (
              <Icon icon="mdi-light:image" className="w-[80%] h-[80%]" />
            )}
          </div>
        </Link>
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
              <ActionMenu
                dropdownRef={dropdownRef}
                item={file}
                itemType={"file"}
                setActiveModal={setActiveModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
