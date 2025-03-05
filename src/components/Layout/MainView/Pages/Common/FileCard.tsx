"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import useClickOutside from "@/hooks/useClickOutside";
import ActionMenu from "./ActionMenu";
import { getSignedUrl } from "@/actions/filesAction";
import Image from "next/image";
import { File, Folder } from "@/types/contentTypes";
import PlaceholderImageCard from "./PlaceholderImageCard";
import { getPreviewInfo } from "@/utils/categoryUtils";

interface FileCardProps {
  file: File;
  setActiveModal: (modal: {
    value: string;
    item: File | Folder | undefined;
    type: string;
  }) => void;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  setActiveModal,
}: FileCardProps) => {
  const pathname = usePathname();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const getBasePath = () => {
    // Match base paths for all sections
    const match = pathname.match(
      /\/cloude\/home\/(my-storage|shared|starred|dashboard)/
    );
    return match ? match[0] : "";
  };

  const basePath = getBasePath();
  const fileLink = `${basePath}/files/${file.id}`;

  useClickOutside(dropdownRef, () => setIsMenuOpen(false));

  useEffect(() => {
    const fetchSignedUrl = async () => {
      const url = await getSignedUrl(file.storage_path);
      setSignedUrl(url);
    };

    if (file?.storage_path) {
      fetchSignedUrl();
    }
  }, [file?.storage_path]);

  const { canPreview, type } = getPreviewInfo(file.file_name);

  const renderPreview = (type: "image" | "video" | null) => {
    if (!signedUrl) {
      return <Icon icon="mdi:file" className="w-[80%] h-[80%]" />;
    }

    if (canPreview) {
      if (type == "image") {
        return (
          <Image
            src={signedUrl}
            fill={true}
            quality={20}
            alt={file.file_name}
            className="object-cover object-center"
          />
        );
      } else if (type === "video") {
        return (
          <video
            src={signedUrl}
            className="w-full h-full object-cover rounded"
          />
        );
      }
    } else {
      return <PlaceholderImageCard fileName={file.file_name} />;
    }
  };

  return (
    <div
      className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-auto 
      mx-[1%] my-[15px] 
      bg-[#F6F6F6] border-[1px] border-[#E4E7EC] 
      flex flex-col 
      rounded-[10px]
      min-h-[45px]
      relative
      shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
      "
    >
      <div className="w-full h-[auto] flex flex-col">
        <Link
          href={fileLink}
          className="w-full aspect-[2/1.5] flex items-end justify-center cursor-pointer overflow-hidden p-[8px]"
        >
          <div
            className="w-[100%] h-[100%] bg-[#FFFFFF] 
            flex items-center justify-center overflow-hidden relative rounded"
          >
            {renderPreview(type)}
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
