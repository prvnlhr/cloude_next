import Searchbar from "./Search/Searchbar";
import HamburgerIcon from "@/components/Icons/HamburgerIcon";

interface NavbarProps {
  toggleSidebarShow: () => void;
}
const Navbar: React.FC<NavbarProps> = ({ toggleSidebarShow }) => {
  return (
    <div className="relative w-full h-[80px] border-b-[1px] border-b-[#E4E7EC] flex items-center justify-start">
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
