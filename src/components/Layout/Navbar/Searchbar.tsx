import { FC } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const Searchbar: FC = () => {
  return (
    <div className="w-[300px] h-[30px] ml-[20px] flex border-[1px] border-[#D0D5DD] rounded ">
      <div className="flex-1 h-full">
        <input
          className="w-full h-full border-none outline-none px-[10px] text-[#1C3553] placeholder:text-[#A2A8B2] placeholder:text-[0.7rem] placeholder:font-medium"
          placeholder="SEARCH"
        />
      </div>
      <div className="h-[100%] aspect-square flex items-center justify-center">
        <Icon icon="mynaui:search" className="w-[65%] h-[65%] text-[#635DB0]" />
      </div>
    </div>
  );
};

export default Searchbar;
