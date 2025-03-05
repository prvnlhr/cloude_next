import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getFileIcon } from "@/utils/categoryUtils";

interface PlaceholderImageCardProps {
  fileName: string;
}
const NonPreviewPlaceholder: React.FC<PlaceholderImageCardProps> = ({
  fileName,
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-evenly bg-white px-[10px]">
      <div className="w-[100%] h-[60px] flex items-end">
        <div className="h-[80%] aspect-square rounded-full bg-[#F1F1F1] flex items-center justify-center p-[8px]">
          <Icon
            icon={getFileIcon(fileName)}
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
  );
};

export default NonPreviewPlaceholder;
