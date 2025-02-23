import { FC } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import HamburgerIcon from "../../Icons/HamburgerIcon";
import UploadModal from "./UploadModal";

type PageHeaderProps = {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const PageHeader: FC<PageHeaderProps> = ({ showSidebar, setShowSidebar }) => {
  // const location = useLocation();
  // const getLabelByPath = (path: string): string | undefined => {
  //   const route = routes.find((route) => route.path === path);
  //   return route?.label;
  // };

  return (
    <div className="w-[100%] h-[70px] border-b-[1px] border-b-[#D0D5DD] flex">
      <section className="w-[50%] h-[100%] flex items-center justify-start">
        <div
          className="w-[20px] h-full flex justify-end items-center aspect-square lg:hidden"
          onClick={() => setShowSidebar((prev) => !prev)}
        >
          {!showSidebar && <HamburgerIcon />}
        </div>
        <div className="flex flex-col items-start justify-center pl-[20px]">
          <p className="text-[#1C3553] text-[1.5rem] font-medium">
            {/* {getLabelByPath(location.pathname)} */}
          </p>
          {/* {location.pathname === "Dashboard" && (
            <p className="text-[#A2A8B2] text-[0.8rem] font-medium whitespace-nowrap">
              Let’s explore your dashboard
            </p>
          )} */}
        </div>
      </section>

      <section className="w-[50%] h-[100%] relative flex items-center justify-end">
        <button
          type="button"
          className="w-[auto] h-[30px] 
          border-[1px] border-[#D0D5DD] bg-[#E4E7EC] 
          flex items-center justify-center 
          px-[10px] mr-[20px]
          cursor-pointer"
        >
          <div className="h-[100%] aspect-square flex items-center justify-center">
            <Icon
              className="text-[#1C3553]"
              icon="material-symbols:upload-rounded"
            />
          </div>
          <p className="text-[#1C3553] text-[0.8rem] hidden md:block">Add</p>
        </button>

        <UploadModal />
      </section>
    </div>
  );
};

export default PageHeader;
