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
import { getFileIcon, getPreviewInfo } from "@/utils/categoryUtils";
import PlaceholderFile from "./PlaceholderFile";
import { formatDate } from "@/utils/contentUtils";
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
  console.log(file);

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
      return (
        <div className="w-[80%] h-full flex items-end justify-center relative">
          {/* <PlaceholderFile /> */}
        </div>
      );
    }

    if (canPreview) {
      if (type == "image") {
        return (
          <div
            className="w-[100%] h-full flex items-end justify-center relative overflow-hidden"
            style={{
              borderRadius: "inherit",
            }}
          >
            <Image
              src={signedUrl}
              fill={true}
              quality={20}
              alt={file.file_name}
              className="object-fill w-full h-full"
            />
          </div>
        );
      } else if (type === "video") {
        return (
          <div className="w-[100%] h-full flex items-end justify-center relative">
            <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
              <Icon
                icon="gravity-ui:play-fill"
                className="w-[24px] h-[24px] text-[#1C3553]"
              />
            </div>
            <video
              src={signedUrl}
              className="w-full h-full object-cover rounded"
            />
          </div>
        );
      }
    } else {
      return (
        <div className="w-[80%] h-[90%] flex justify-center items-end relative">
          <div className="w-full h-full  flex flex-col items-center z-[2]">
            <div className="w-[85%]  h-[40px] flex items-end justify-start">
              <div className="h-[80%] aspect-square flex items-center justify-center rounded-full bg-[#F7F7F7]">
                <Icon
                  icon={getFileIcon(file.file_name)}
                  className="w-[70%] h-[70%] text-[#87ADF4]"
                />
              </div>
            </div>
            <div className="w-full  h-[calc(100%-40px)] flex flex-col items-center justify-evenly">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="w-[80%] h-[5px] bg-[#F7F7F7]"></div>
              ))}
            </div>
          </div>
          <PlaceholderFile />
        </div>
      );
    }
  };

  return (
    <div
      className="w-[45%] sm:w-[45%] md:w-[30%] lg:w-[18%] h-auto 
      flex flex-col items-center bg-white 
      p-[6px] my-[15px]
      mx-[2.5%] sm:mx-[2.5%] md:mx-[1.5%] lg:mx-[1%]
      rounded-[10px]
      shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
      hover:shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]
      relative"
    >
      <Link
        href={fileLink}
        className="w-full aspect-[3/2] bg-[#F7F7F7] flex justify-center items-end"
        style={{
          borderRadius: "inherit",
        }}
      >
        {renderPreview(type)}
      </Link>
      <div className="w-[95%] h-[80px] flex flex-col relative">
        <div className="w-full h-[30px] flex items-end justify-start">
          <div className="h-[70%] w-auto flex items-center justify-center px-[8px] bg-[#DDE8FC] rounded">
            <p className="text-[#1C3553] text-[0.6rem] font-bold p-0 m-0">
              {file.extension}
            </p>
          </div>
        </div>
        <div className="w-full h-[50px] flex min-w-0 relative">
          <div className="h-full flex-grow flex flex-col items-start justify-center overflow-hidden">
            <p className="text-[#1C3553] w-[95%] text-[0.8rem] font-medium truncate whitespace-nowrap">
              {file.file_name}
            </p>
            <p className="text-[#A2A8B2] w-full text-[0.65rem] font-medium truncate whitespace-nowrap">
              {formatDate(file.created_at)}
            </p>
          </div>
          <div className="h-full aspect-[1/1.8] flex-shrink-0 flex items-center justify-end relative">
            <button
              onClick={toggleMenu}
              type="button"
              className="w-[100%] aspect-square flex items-center  justify-center bg-[#F2F2F2] border-[#F0F0F0] rounded-full"
            >
              <Icon
                icon="qlementine-icons:menu-dots-16"
                className="w-[60%] h-[60%] text-[#1C3553]"
              />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <ActionMenu
          dropdownRef={dropdownRef}
          item={file}
          itemType={"file"}
          setActiveModal={setActiveModal}
        />
      )}
    </div>
  );
};

export default FileCard;
