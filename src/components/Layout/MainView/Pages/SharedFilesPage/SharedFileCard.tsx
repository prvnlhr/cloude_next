import { FC } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";

const SharedFileCard: FC = () => {
  return (
    <div className="w-[100%] h-[150px] sm:h-[200px] flex flex-col border-[1px] border-[#E4E7EC] rounded-t-[10px] overflow-hidden">
      <div className="w-full h-[calc(100%-40px)] bg-[#F4F6F6] flex justify-center items-end">
        <div className="w-[80%] h-[90%] bg-[white] rounded-t-[10px]"></div>
      </div>
      <div className="w-full h-[40px] border-t-[1px] border-[#E4E7EC] flex">
        <div className="h-full flex-1 overflow-hidden flex justify-start items-center pl-[8px]">
          <p className="text-[0.8rem] text-[#1C3553] font-medium truncate">
            Magazine cover.jpeg
          </p>
        </div>
        <div className="h-full aspect-[1/1.5] flex items-center justify-center">
          <Icon
            icon="qlementine-icons:menu-dots-16"
            className="w-[80%] h-[80%] text-[#1C3553]"
          />
        </div>
      </div>
    </div>
  );
};

export default SharedFileCard;
