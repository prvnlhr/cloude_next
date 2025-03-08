"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getSignedUrl } from "@/actions/filesAction";
import Image from "next/image";
import useUserSession from "@/hooks/useUserSession";
import { removeFromShared } from "@/lib/services/shared/sharedServices";
import { Spinner } from "@heroui/spinner";
import { File } from "@/types/contentTypes";
import { getFileIcon, getPreviewInfo } from "@/utils/categoryUtils";
import PlaceholderFile from "../Common/PlaceholderFile";

const SharedByMeFileCard = ({ file }: { file: File }) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const session = useUserSession();
  const [isLoading, setIsLoading] = useState(false);

  const fileLink = `${"/cloude/home/my-storage"}/files/${file.id}`;

  useEffect(() => {
    const fetchSignedUrl = async () => {
      const url = await getSignedUrl(file.storage_path);
      setSignedUrl(url);
    };

    if (file?.storage_path) {
      fetchSignedUrl();
    }
  }, [file?.storage_path]);

  const handleRemoveSharedFile = async () => {
    setIsLoading(true);

    try {
      const userId = session?.userId as string;
      const removeData = {
        userId,
        itemId: file.id,
        itemType: "file",
      };
      const removeFromSharedResponse = await removeFromShared(removeData);
      console.log(" removeFromSharedResponse:", removeFromSharedResponse);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
        href={fileLink}
        className="w-full aspect-[3/2] bg-[#F7F7F7] flex justify-center items-end"
        style={{
          borderRadius: "inherit",
        }}
      >
        {renderPreview(type)}
      </Link>
      <div className="w-[100%] h-[80px] flex flex-col relative">
        <div className="w-full h-[35px] flex items-center justify-start ">
          <p className="text-[#1C3553] w-[95%] ml-[5px] text-[0.8rem] font-medium truncate whitespace-nowrap">
            {file.file_name}
          </p>
        </div>
        <div className="w-full h-[45px] flex items-center justify-start  min-w-0 bg-[#F7F7F7]  rounded">
          <div className="h-full aspect-square flex items-center justify-center flex-shrink-0">
            <div className="w-[70%] h-[70%] flex items-center justify-center bg-[white] rounded">
              <Icon
                icon="heroicons:link-20-solid"
                className="w-[60%] h-[60%] text-[#5B8DF4]"
              />
            </div>
          </div>
          <div className="h-full flex-grow flex flex-col items-center justify-center min-w-0">
            <p className="text-[#A2A8B2] w-full text-[0.65rem] font-medium truncate whitespace-nowrap">
              Shared with
            </p>
            <p className="text-[#1C3553] w-full text-[0.8rem] font-medium truncate whitespace-nowrap">
              {file.users?.full_name}
            </p>
          </div>
          <div className="h-full w-[45px] min-w-[45px] flex items-center justify-center flex-shrink-0">
            <button
              onClick={handleRemoveSharedFile}
              type="button"
              className="w-[65%] h-[65%] flex items-center justify-center bg-[white] rounded-full"
            >
              {isLoading ? (
                <Spinner variant="gradient" color="primary" size="sm" />
              ) : (
                <Icon
                  icon="iconamoon:close-duotone"
                  className="w-[55%] h-[55%] text-[#5B8DF4]"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedByMeFileCard;
