import Searchbar from "./Search/Searchbar";
import HamburgerIcon from "@/components/Icons/HamburgerIcon";

const Navbar: FC = ({ toggleSidebarShow }) => {
  return (
    <div className="relative w-full h-[80px] border-b-[1px] border-b-[#D0D5DD] flex items-center justify-start">
      <div
        className="w-[15px] h-full flex items-center lg:hidden"
        onClick={toggleSidebarShow}
      >
        <HamburgerIcon />
      </div>
      <Searchbar />
    </div>
  );
};

export default Navbar;
