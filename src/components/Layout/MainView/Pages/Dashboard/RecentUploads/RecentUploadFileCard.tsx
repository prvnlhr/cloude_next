"use client";
import { getSignedUrl } from "@/actions/filesAction";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { RecentUploadFile } from "@/types/dashboardTypes";
import { getFileIcon } from "@/utils/categoryUtils";
interface RecentUploadFileCardProps {
  item: RecentUploadFile;
}

const RecentUploadFileCard: React.FC<RecentUploadFileCardProps> = ({
  item,
}) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  const fetchSignedUrl = useCallback(async () => {
    if (!signedUrl && item?.storage_path) {
      const url = await getSignedUrl(item.storage_path);
      setSignedUrl(url);
    }
  }, [item?.storage_path, signedUrl]);

  useEffect(() => {
    fetchSignedUrl();
  }, [fetchSignedUrl]);

  const isVideo = ["video/mp4", "video/webm", "video/ogg"].includes(
    item.file_type
  );
  const isImage = item.file_type.startsWith("image/");

  return (
    <div className="h-[80%] max-w-[150px] sm:w-[45%] aspect-square bg-[#F6F6F6] border-[1px] border-[#E4E7EC]  rounded-[10px] shadow-[0px_3px_5px_rgba(0,0,0,0.04)] flex flex-col items-center mx-[10px]">
      {/* File Preview Container */}
      <div className="w-full h-[calc(100%-30px)] p-[8px]">
        <div className="w-full h-full bg-white rounded flex items-center justify-center relative">
          {signedUrl ? (
            isImage ? (
              <Image
                src={signedUrl}
                fill={true}
                quality={20}
                alt={item.file_name}
                className="object-cover object-center rounded"
              />
            ) : isVideo ? (
              <video
                src={signedUrl}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-evenly bg-white px-[10px]">
                <div className="w-[100%] h-[60px] flex items-center">
                  <div className="h-[70%] aspect-square rounded-full bg-[#F1F1F1] flex items-center justify-center p-[8px]">
                    <Icon
                      icon={getFileIcon(item.file_name)}
                      className="w-full h-full text-[#1C3553]"
                    />
                  </div>
                </div>
                <div className="w-full h-[calc(100%-40px)] flex flex-col items-center justify-evenly">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-[8px] bg-[#F1F1F1] rounded"
                    ></div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <Icon icon="mdi-light:image" className="w-[80%] h-[80%]" />
          )}
        </div>
      </div>

      {/* File Name & Link */}
      <div className="w-[90%] h-[30px] flex items-center">
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-[0.7rem] w-[95%] text-[#1C3553] font-medium truncate">
            {item.file_name}
          </p>
        </div>
        <Link
          href={`/cloude/home/my-storage/files/${item.id}`}
          className="h-[80%] aspect-square flex items-center justify-center bg-white border border-[#E4E7EC] rounded-full"
        >
          <Icon
            icon="meteor-icons:arrow-up"
            className="w-[60%] h-[60%] text-[#1C3553] rotate-45"
          />
        </Link>
      </div>
    </div>
  );
};

export default RecentUploadFileCard;
