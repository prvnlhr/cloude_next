import { FC } from "react";
import Searchbar from "./Searchbar";

const Navbar: FC = () => {
  return (
    <div className="w-full h-[80px] border-b-[1px] border-b-[#D0D5DD] flex items-center justify-start">
      <Searchbar />
    </div>
  );
};

export default Navbar;
