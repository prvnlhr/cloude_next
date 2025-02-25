import { FC } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const Searchbar: FC = () => {
  return (
    <div className="w-[200px] rounded-[5px] h-[30px] ml-[20px] flex items-center border-[1px] border-[#D0D5DD]">
      <div className="h-full flex-grow px-[10px] flex items-center">
        <input
          className="w-full h-full outline-none text-[#1C3553] placeholder:text-[#A2A8B2] placeholder:text-[0.7rem] placeholder:font-medium"
          placeholder="SEARCH"
        />
      </div>
      <div className="h-full aspect-square flex-shrink-0 flex items-center justify-center">
        <Icon icon="mynaui:search" className="w-[65%] h-[65%] text-[#635DB0]" />
      </div>
    </div>
  );
};

export default Searchbar;
