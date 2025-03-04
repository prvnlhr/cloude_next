"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import { getSignedUrl } from "@/actions/filesAction";
import Image from "next/image";
import { canPreview } from "@/utils/previewUtil";
import useUserSession from "@/hooks/useUserSession";
import { removeFromShared } from "@/lib/services/shared/sharedServices";
import { Spinner } from "@heroui/spinner";
import { File } from "@/types/contentTypes";
import { getFileIcon } from "@/utils/categoryUtils";

const SharedByMeFileCard = ({ file }: { file: File }) => {
  const pathname = usePathname();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const session = useUserSession();
  const [isLoading, setIsLoading] = useState(false);

  const getBasePath = () => {
    // Match base paths for all sections
    const match = pathname.match(
      /\/cloude\/home\/(my-storage|shared|starred|dashboard)/
    );
    return match ? match[0] : "";
  };

  const basePath = getBasePath();
  const fileLink = `${basePath}/files/${file.id}`;

  useEffect(() => {
    const fetchSignedUrl = async () => {
      const url = await getSignedUrl(file.storage_path);
      setSignedUrl(url);
    };

    if (file?.storage_path) {
      fetchSignedUrl();
    }
  }, [file?.storage_path]);

  const isVideo = ["video/mp4", "video/webm", "video/ogg"].includes(
    file.file_type
  );

  const handleRemoveSharedFolder = async () => {
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
      <div className="w-full h-[auto]flex flex-col">
        <Link
          href={fileLink}
          className="w-full aspect-[2/1.5] flex items-end justify-center cursor-pointer overflow-hidden p-[8px]"
        >
          <div
            className="w-[100%] h-[100%] bg-[#FFFFFF] 
            flex items-center justify-center overflow-hidden relative rounded"
          >
            {signedUrl ? (
              isVideo ? (
                <video
                  src={signedUrl}
                  className="w-full h-full object-cover rounded"
                />
              ) : canPreview(file.file_type) ? (
                <Image
                  src={signedUrl}
                  fill={true}
                  quality={20}
                  alt={file.file_name}
                  className="object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-evenly bg-white px-[10px]">
                  <div className="w-[100%] h-[60px] flex items-end">
                    <div className="h-[80%] aspect-square rounded-full bg-[#F1F1F1] flex items-center justify-center p-[8px]">
                      <Icon
                        icon={getFileIcon(file.file_name)}
                        className="w-full h-full text-[#1C3553]"
                      />
                    </div>
                  </div>
                  <div className="w-full h-[calc(100%-40px)] flex flex-col items-center justify-evenly">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="w-full h-[10px] bg-[#F1F1F1] rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              )
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
          <div className="h-[100%] aspect-square   flex items-center justify-center cursor-pointer">
            <button
              onClick={handleRemoveSharedFolder}
              className="w-[70%] aspect-square flex items-center justify-center bg-white border border-[#E4E7EC] rounded-full"
            >
              {isLoading ? (
                <Spinner variant="gradient" color="primary" size="sm" />
              ) : (
                <Icon
                  icon="iconamoon:close-fill"
                  className="w-[60%] h-[60%] text-[#1C3553]"
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
