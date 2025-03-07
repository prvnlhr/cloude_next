import { FC, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import useClickOutside from "@/hooks/useClickOutside";
import AddMenu from "./AddMenu";
import { usePathname } from "next/navigation";
import BackBtn from "./Pages/Common/BackBtn";

const PageHeader: FC = () => {
  const menuRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const pathSegments = pathname.split("/");

  let heading = "";
  if (pathSegments.includes("my-storage")) {
    heading = "My Storage";
  } else if (pathSegments.includes("shared")) {
    heading = "Shared";
  } else if (pathSegments.includes("starred")) {
    heading = "Starred";
  } else if (pathSegments.includes("dashboard")) {
    heading = "Dashboard";
  }
  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  return (
    <div className="w-[100%] h-[70px] border-b-[1px] border-b-[#EFEFEF] flex">
      <section className="w-[50%] h-[100%] flex items-center justify-start">
        <BackBtn />
        <div className="flex flex-col items-start justify-center">
          <p className="text-[#1C3553] text-[1.5rem] font-medium">{heading}</p>
          {heading === "Dashboard" && (
            <p className="text-[#A2A8B2] text-[0.8rem] font-medium whitespace-nowrap">
              Let’s explore your dashboard
            </p>
          )}
        </div>
      </section>

      <section className="w-[50%] h-[100%] relative flex items-center justify-end">
        <button
          type="button"
          className="w-[auto] h-[30px] 
          border-[1px] border-[#EFEFEF] bg-[#87ADF4] 
          flex items-center justify-center 
          cursor-pointer
          mr-[15px]
          rounded
          "
          onClick={toggleMenu}
        >
          <div className="h-[100%] aspect-[1/1] flex items-center justify-center black">
            <Icon
              icon="material-symbols:upload-rounded"
              className="text-white"
            />
          </div>
          <p
            className="text-white text-[0.8rem] font-medium
           mr-[15px]"
          >
            Upload
          </p>
        </button>
        {isMenuOpen && <AddMenu menuRef={menuRef} />}
      </section>
    </div>
  );
};

export default PageHeader;
