import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { headers } from "next/headers";

interface Folder {
  folderId: string;
  folderName: string;
}

const FolderCard = async ({ folder }: { folder: Folder }) => {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  return (
    <Link
      href={`${pathname}/folders/${folder.folderId}`}
      className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-[40px] mx-[1%] my-[15px] flex border border-[#E4E7EC] bg-[#F4F6F6] rounded-[8px]"
    >
      <div className="h-full aspect-square flex items-center justify-center">
        <Icon
          icon="solar:folder-linear"
          className="w-[50%] h-[50%] text-[#1C3553]"
        />
      </div>
      <div className="h-full flex-1 flex items-center overflow-hidden">
        <p className="text-[#1C3553] text-[0.75rem] font-medium  whitespace-nowrap truncate">
          {folder.folderName}
        </p>
      </div>
      <div className="h-full aspect-square flex items-center justify-center">
        <Icon
          icon="qlementine-icons:menu-dots-16"
          className="w-[50%] h-[50%] text-[#1C3553]"
        />
      </div>
    </Link>
  );
};

export default FolderCard;
