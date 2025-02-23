import { Icon } from "@iconify/react/dist/iconify.js";

const RecentUploadFileCard = () => {
  return (
    <div className="h-[90%] aspect-[4/4] mr-[30px]">
      <div className="w-full h-[calc(100%-25px)]  flex justify-center items-start">
        <div className="w-[100%] h-[95%] border border-[#F0F0F0]  bg-[#F4F6F6] rounded-[5px] flex justify-center items-end">
          <div className="w-[80%] h-[90%] bg-[#FFFFFF] rounded-t-[5px] flex"></div>
        </div>
      </div>
      <div className="w-full h-[25px] flex">
        <div className="h-full flex-1 flex justify-start items-center">
          <p className="text-[0.7rem] text-[#1C3553] font-medium ml-[3px]">
            Project Brief.pdf
          </p>
        </div>
        <div className="h-full aspect-[1/2] flex justify-center items-center">
          <Icon
            icon="qlementine-icons:menu-dots-16"
            className="w-[100%] h-[100%] text-[#1C3553]"
          />
        </div>
      </div>
    </div>
  );
};

export default RecentUploadFileCard;
