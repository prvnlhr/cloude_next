"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { removeFromShared } from "@/lib/services/shared/sharedServices";
import useUserSession from "@/hooks/useUserSession";
import { useState } from "react";
import { Spinner } from "@heroui/spinner";
import { Folder } from "@/types/contentTypes";

const SharedByMeFolderCard = ({ folder }: { folder: Folder }) => {
  const session = useUserSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveSharedFolder = async () => {
    setIsLoading(true);
    console.log(folder);

    try {
      const userId = session?.userId as string;
      const removeData = {
        userId,
        itemId: folder.id,
        itemType: "folder",
      };
      const removeFromSharedResponse = await removeFromShared(removeData);
      console.log(" removeFromSharedResponse:", removeFromSharedResponse);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const folderLink = `${"/cloude/home/my-storage"}/folders/${folder.id}`;

  return (
    <div
      className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-auto 
      mx-[1%] my-[15px] 
      bg-[#F6F6F6] border-[1px] border-[#E4E7EC] 
      flex
      justify-between  
      rounded-[10px]
      min-h-[40px]
      relative
      z-[4]
      cursor-pointer
      shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
      "
    >
      <div className="w-full h-[50px] flex">
        <Link href={folderLink} className="w-full h-full flex">
          <div className="h-full w-[40px] min-w-[40px] flex items-center justify-center">
            <Icon
              icon="solar:folder-linear"
              className="w-[50%] h-[50%] text-[#1C3553]"
            />
          </div>
          <div className="h-full flex-grow flex flex-col items-start justify-center overflow-hidden">
            <p className="text-[#1C3553] text-[0.75rem] font-medium  whitespace-nowrap truncate">
              {folder?.folder_name}
            </p>
            <p className="text-[#A2A8B2] text-[0.75rem] font-medium  whitespace-nowrap truncate">
              To :{" "}
              <span className="text-[#1C3553] underline">
                {folder?.users?.full_name}
              </span>
            </p>
          </div>
        </Link>
        <div className="h-full w-[45px] min-w-[45px] flex items-center justify-center cursor-pointer">
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
  );
};

export default SharedByMeFolderCard;
