"use client";
import { getSignedUrl } from "@/actions/filesAction";
import { getFileIcon, getPreviewInfo } from "@/utils/categoryUtils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { File } from "@/types/contentTypes";
import { formatDate } from "@/utils/contentUtils";
import PlaceholderFile from "../../Common/PlaceholderFile";

interface FileCardProps {
  file: File;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const { canPreview, type } = getPreviewInfo(file.file_name);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      const url = await getSignedUrl(file.storage_path);
      setSignedUrl(url);
    };

    if (file?.storage_path) {
      fetchSignedUrl();
    }
  }, [file?.storage_path]);

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
              className="border border-gray-100 object-cover"
              style={{
                borderRadius: "inherit",
              }}
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
                  className="w-[70%] h-[70%] text-[#5B8DF4]"
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
        href={`/cloude/home/my-storage/files/${file.id}`}
        className="w-full aspect-[3/2] bg-[#F7F7F7] flex justify-center items-end"
        style={{
          borderRadius: "inherit",
        }}
      >
        {renderPreview(type)}
      </Link>
      <div className="w-[95%] h-[80px] flex flex-col relative">
        <div className="w-full h-[30px] flex items-end justify-start">
          <div className="h-[70%] w-auto flex items-center justify-center px-[8px] bg-[#DDE8FD] rounded">
            <p className="text-[#4B74D7] text-[0.6rem] font-bold p-0 m-0">
              {file.extension?.toUpperCase()}
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
          <div className="h-full aspect-[1/1.8] flex-shrink-0 flex items-center justify-end relative"></div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
