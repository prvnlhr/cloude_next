import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

const ActionMenu = ({ dropdownRef, isOpen }) => {
  return (
    <div
      ref={dropdownRef}
      className={`w-auto h-[auto] flex flex-col absolute top-[50px] right-[5px] bg-white shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] p-[5px] rounded border`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <button className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium  hover:bg-[#EAECEB] px-[10px] rounded">
          <div className="h-full aspect-[1/2] flex items-center justify-center">
            <Icon icon="mingcute:edit-line" className="w-[75%] h-[75%]" />
          </div>
          <p className="text-[0.7rem] text-[#1C3553] ml-[9px]">Rename</p>
        </button>
        <Link
          href={"shareUrl"}
          className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium  hover:bg-[#EAECEB] px-[10px] rounded"
        >
          <div className="h-full aspect-[1/2] flex items-center justify-center">
            <Icon icon="mynaui:share" className="w-[75%] h-[75%]" />
          </div>
          <p className="text-[0.7rem] text-[#1C3553] ml-[9px]">Share</p>
        </Link>
        <button
          type="button"
          className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium  hover:bg-[#EAECEB] px-[10px] rounded"
        >
          <div className="h-full aspect-[1/2] flex items-center justify-center">
            <Icon icon="solar:trash-bin-2-linear" className="w-[75%] h-[75%]" />
          </div>
          <p className="text-[0.7rem] text-[#1C3553] ml-[9px]">Delete</p>
        </button>
        <button
          type="button"
          className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium  hover:bg-[#EAECEB] px-[10px] rounded"
        >
          <div className="h-full aspect-[1/2] flex items-center justify-center">
            <Icon icon="solar:star-line-duotone" className="w-[75%] h-[75%]" />
          </div>
          <p className="text-[0.7rem] text-[#1C3553] ml-[9px]">
            Add to Starred
          </p>
        </button>
      </div>
    </div>
  );
};

export default ActionMenu;

{
  /* <Icon icon="famicons:chevron-down-outline" /> */
}
{
  /* <Icon icon="mynaui:share" /> */
}
{
  /* <Icon icon="solar:star-line-duotone" /> */
}
{
  // <Icon icon="mdi:rename-box-outline" />
}
