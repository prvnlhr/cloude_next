"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { removeFromShared } from "@/lib/services/shared/sharedServices";
import useUserSession from "@/hooks/useUserSession";
import { useState } from "react";
// import { Spinner } from "@heroui/spinner";
import { Folder } from "@/types/contentTypes";
import { Spinner } from "@heroui/spinner";

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
      className="w-[45%] sm:w-[45%] md:w-[30%] lg:w-[18%] h-auto 
    flex flex-col items-center bg-white 
    p-[6px] my-[15px]
    mx-[2.5%] sm:mx-[2.5%] md:mx-[1.5%] lg:mx-[1%]
    rounded-[10px]
    shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
    hover:shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]
    relative
    "
    >
      <div className="w-full h-[40px] flex items-start justify-start rounded-[10px]">
        <div
          className="h-full aspect-square bg-[#F7F7F7] flex items-center justify-center"
          style={{
            borderRadius: "inherit",
          }}
        >
          <Icon
            icon="solar:folder-bold"
            className="w-[60%] h-[60%] text-[#88B1F5]"
          />
        </div>
        <Link
          href={folderLink}
          className="h-full flex-grow min-w-0 flex flex-col justify-center"
        >
          <p className="text-[#1C3553] w-[90%] ml-[10px] text-[0.8rem] font-medium truncate whitespace-nowrap">
            {folder.folder_name}
          </p>
          <p className="text-[#A2A8B2] w-full ml-[10px] text-[0.65rem] font-medium truncate whitespace-nowrap">
            {/* {formatDate(folder.created_at)} */}
          </p>
        </Link>
      </div>
      <div className="w-full h-[45px] mt-[5px] flex items-center justify-start  min-w-0 bg-[#F7F7F7] rounded">
        <div className="h-full aspect-square flex items-center justify-center flex-shrink-0">
          <div className="w-[70%] h-[70%] flex items-center justify-center bg-[white] rounded">
            <Icon
              icon="heroicons:link-20-solid"
              className="w-[60%] h-[60%] text-[#88B1F5]"
            />
          </div>
        </div>
        <div className="h-full flex-grow flex flex-col items-center justify-center">
          <p className="text-[#A2A8B2] w-full text-[0.65rem] font-medium truncate whitespace-nowrap">
            Shared with
          </p>
          <p className="text-[#1C3553] w-full text-[0.8rem] font-medium truncate whitespace-nowrap">
            {folder.users?.full_name}
          </p>
        </div>
        <div className="h-full w-[45px] min-w-[45px] flex items-center justify-center flex-shrink-0">
          <button
            onClick={handleRemoveSharedFolder}
            type="button"
            className="w-[65%] h-[65%] flex items-center justify-center bg-[white] rounded-full"
          >
            {isLoading ? (
              <Spinner variant="gradient" color="primary" size="sm" />
            ) : (
              <Icon
                icon="iconamoon:close-duotone"
                className="w-[55%] h-[55%] text-[#88B1F5]"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedByMeFolderCard;
