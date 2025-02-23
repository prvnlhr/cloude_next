import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

interface File {
  fileId: string;
  fileName: string;
}
interface FileCardProps {
  file: File;
  basePath: string;
}

const FileCard = async ({ file, basePath }: FileCardProps) => {
  return (
    <Link
      href={`${basePath}/files/${file.fileId}`}
      className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-auto mx-[1%] my-[15px] bg-[#F4F6F6] border-[1px] border-[#E4E7EC] flex flex-col rounded-[10px]"
    >
      <div className="w-full h-[40px] flex pl-[10%] overflow-hidden">
        <div className="flex-1 h-full flex items-center justify-start overflow-hidden">
          <p className="text-[0.75rem] text-[#1C3553] font-medium truncate whitespace-nowrap">
            {file.fileName}
          </p>
        </div>
        <div className="h-full aspect-square flex items-center justify-center">
          <Icon
            icon="qlementine-icons:menu-dots-16"
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
        </div>
      </div>
      <div className="w-full aspect-[3/2] flex justify-center items-end">
        <div className="w-[80%] h-[100%] bg-[#FFFFFF]"></div>
      </div>
    </Link>
  );
};

export default FileCard;
