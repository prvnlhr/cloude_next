"use client";
import { getSignedUrl } from "@/actions/filesAction";
import { getPreviewInfo } from "@/utils/categoryUtils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { File } from "@/types/contentTypes";
import NonPreviewPlaceholder from "../../Common/NonPreviewPlaceholder";
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

  return (
    <div
      className="
      w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-auto 
      mx-[1%] my-[15px] 
      bg-[#F6F6F6] border-[1px] border-[#E4E7EC] 
      flex flex-col 
      rounded-[10px]
      min-h-[45px]
      relative
      shadow-[0px_3px_5px_rgba(0,0,0,0.04)]"
    >
      <div className="w-full h-auto flex flex-col">
        <Link
          href={`/cloude/home/my-storage/files/${file.id}`}
          className="w-full aspect-[2/1.5] flex items-end justify-center cursor-pointer overflow-hidden p-[8px]"
        >
          <div
            className="w-[100%] h-[100%] bg-[#FFFFFF] 
            flex items-center justify-center overflow-hidden relative rounded"
          >
            {canPreview && signedUrl ? (
              type === "image" ? (
                <Image
                  src={signedUrl}
                  fill={true}
                  quality={20}
                  alt={file.file_name}
                  className="object-cover object-center"
                />
              ) : (
                <video
                  className="w-full h-full object-cover object-center"
                  src={signedUrl}
                />
              )
            ) : (
              <NonPreviewPlaceholder fileName={file.file_name} />
            )}
          </div>
        </Link>
        <div className="w-full h-[45px] flex">
          <div className="h-full aspect-square flex-grow  overflow-hidden flex items-center justify-start">
            <p className="ml-[9%] text-[0.75rem] text-[#1C3553] font-medium truncate whitespace-nowrap">
              {file?.file_name}
            </p>
          </div>
          <button
            disabled
            className="h-[100%] aspect-square  flex items-center justify-center cursor-pointer"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
