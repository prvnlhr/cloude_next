import { FC, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import AppLogo from "./AppLogo";
import HamburgerIcon from "../../Icons/HamburgerIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Routes } from "@/lib/homeRoutes";
import { signout } from "@/actions/auth";
import useUserSession from "@/hooks/useUserSession";
import { Spinner } from "@heroui/spinner";

interface SidebarProps {
  toggleSidebarShow: () => void;
}
const Sidebar: FC<SidebarProps> = ({ toggleSidebarShow }) => {
  const pathname = usePathname();

  const session = useUserSession();
  const [isSigningOut, setIsSigningOut] = useState<boolean>();

  const [showLogoutOption, setShowLogoutOption] = useState(false);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      const signoutResponse = await signout();
      console.log(" signoutResponse:", signoutResponse);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="w-[100%] left-[-100%] h-full border-r-[1px] border-r-[#E4E7EC] flex flex-col bg-[#F3F7FA]">
      <section className="w-[100%] h-[80px] flex items-center justify-start relative">
        <div className="h-[40%] border-[#EFEFEF] ml-[20px]">
          <AppLogo />
        </div>
        <div
          className="w-[15px] absolute right-0 h-full lg:hidden"
          onClick={toggleSidebarShow}
        >
          <HamburgerIcon />
        </div>
      </section>

      <section className="w-full h-[calc(100%-80px)] flex flex-col">
        <div
          className={`w-full h-[${
            showLogoutOption ? 100 : 70
          }px]  transition-all duration-300 ease-in-out flex flex-col overflow-hidden items-center`}
        >
          <div className="w-full h-[70px] min-h-[70px] flex justify-center relative">
            <div className="w-[80%] border-t-[1px] border-t-[#E4E7EC] border-b-[1px] border-b-[#E4E7EC] h-full flex items-center">
              <div className="h-full aspect-square  flex items-center justify-center">
                <div className="w-[70%] aspect-square rounded-full bg-[white] border flex items-center justify-center">
                  <p className="text-[1rem] text-[#635DB0] font-semibold">
                    {session?.userName.charAt(0)}
                  </p>
                </div>
              </div>
              <div className="h-full flex-grow  flex flex-col justify-center overflow-hidden">
                <p className="text-[1rem] sm:text-[1rem] md:text-[1rem] lg:text-[1rem] text-[#1C3553] font-medium truncate max-w-[90%]">
                  {session?.userName}
                </p>
                <p className="text-[0.9rem] sm:text-[0.9rem] md:text-[0.8rem] lg:text-[0.8rem] text-[#A2A8B2] font-medium truncate max-w-[90%]">
                  {session?.email}
                </p>
              </div>
              <div
                className="w-[20px] min-w-[20px] h-[70%] rounded flex items-center justify-center border border-[#F0F0F0] bg-[white] cursor-pointer"
                onClick={() => setShowLogoutOption((prev) => !prev)}
              >
                <Icon
                  icon="famicons:chevron-down-outline"
                  className="text-[#A2A8B2] w-full aspect-square"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-[80%] h-[30px] min-h-[30px] rounded flex justify-center items-center bg-red-200 border ${
              showLogoutOption ? "border-red-600" : "boreder-[#F0F0F0]"
            }`}
          >
            {isSigningOut ? (
              <Spinner variant="gradient" color="danger" size="sm" />
            ) : (
              <p className="text-[0.8rem] font-medium text-red-600">Logout</p>
            )}
          </button>
        </div>
        <div
          className={`w-full flex-grow  flex flex-col items-center justify-start pt-[20px]`}
        >
          {Routes.map((route) => {
            const isActive = pathname.startsWith(route.path);
            return (
              <Link
                onClick={toggleSidebarShow}
                href={route.path}
                key={route.label}
                className={`w-[70%] h-[40px] rounded-[10px] flex my-[10px] pr-[15px]
                ${
                  isActive
                    ? "bg-[white] border border-[#EFEFEF]"
                    : "bg-transparent"
                }
                `}
              >
                <div className="h-full aspect-square flex justify-center items-center">
                  <Icon
                    icon={isActive ? route.activeIcon : route.inactiveIcon}
                    className="w-[50%] h-[50%]"
                    style={{ color: isActive ? "#88B1F5" : "#A2A8B2" }}
                  />
                </div>
                <div className="flex-1 h-full flex items-center">
                  <p
                    className={`text-[1rem] sm:text-[1rem] md:text-[1rem] lg:text-[0.9rem] ${
                      isActive ? "font-semibold" : "font-medium"
                    }`}
                    style={{ color: isActive ? "#88B1F5" : "#A2A8B2" }}
                  >
                    {route.label}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Sidebar;
