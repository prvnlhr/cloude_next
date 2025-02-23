import { FC, useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import AppLogo from "./AppLogo";
import HamburgerIcon from "../../Icons/HamburgerIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Routes } from "@/config/routes";
import { logoutUser } from "@/lib/api/auth/authApi";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/actions/auth";

type SidebarProps = {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

// Sidebar component displays navigation and user info
const Sidebar: FC<SidebarProps> = ({ showSidebar, setShowSidebar }) => {
  const pathname = usePathname();
  const supabase = createClient();

  const [session, setSession] = useState<{
    userName: string;
    email: string;
    userId: string;
  } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session) {
          const { display_name, email } = data.session.user.user_metadata;
          setSession({
            userName: display_name,
            email,
            userId: data.session.user.id,
          });
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const { display_name, email } = session.user.user_metadata;
          setSession({
            userName: display_name,
            email,
            userId: session.user.id,
          });
        } else {
          setSession(null);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    try {
      const res = await signout();
      console.log(res);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <div className="w-[100%] left-[-100%] h-full border-r-[1px] border-r-[#D0D5DD] flex flex-col">
      {/* App Logo ---------------------- */}
      <div className="w-[100%] h-[80px] flex items-center justify-start">
        <div className="h-[40%] border-[#D0D5DD] ml-[20px]">
          <AppLogo />
        </div>
      </div>

      <div className="w-[100%] h-[70px] flex items-center justify-center relative">
        <div
          className="w-[20px] h-full flex justify-end items-center absolute right-0 aspect-square lg:hidden"
          onClick={() => setShowSidebar((prev) => !prev)}
        >
          {showSidebar && <HamburgerIcon />}
        </div>

        <div className="w-[80%] h-[100%]  border-t-[1px] border-b-[1px] border-t-[#D0D5DD] border-b-[#D0D5DD] flex">
          {/* User circular badge --------------------- */}
          <div className="h-[100%] aspect-square flex items-center justify-center">
            <div className="w-[70%] aspect-square bg-[#D9D9D9] rounded-full flex items-center justify-center">
              <p className="text-[#635DB0] text-[1.2rem] font-medium">
                {session?.userName.charAt(0)}
              </p>
            </div>
          </div>

          {/* User info card --------------------------- */}
          <div className="w-[auto] h-full flex flex-col justify-center overflow-hidden">
            <p className="text-[#1C3553] text-[1.1rem] font-medium truncate">
              {session?.userName}
            </p>
            <p className="text-[#A2A8B2] text-[0.8rem] font-medium truncate">
              {session?.email}
            </p>
          </div>
          <button
            type="button"
            className="w-[20px] h-full flex items-center justify-center ml-[5px]"
            onClick={handleLogout}
          >
            <Icon
              icon="ci:chevron-down"
              className="w-[100%] h-[100%] text-[#A2A8B2]"
            />
          </button>
        </div>
      </div>

      {/* Sidebar Menu Items ------------------------------- */}
      <div className="w-[100%] h-[calc(100%-150px)] flex flex-col items-center justify-start pt-[20px]">
        {Routes.map((route) => (
          <Link
            href={route.path}
            key={route.label}
            className={`w-[70%] h-[40px] rounded-[10px] flex my-[10px] pr-[15px]
               ${pathname === route.path ? "bg-[#F3F2F2]" : "bg-transparent"}
               `}
          >
            <div className="h-full aspect-square flex justify-center items-center">
              <Icon
                icon={route.icon}
                className="w-[50%] h-[50%] text-[#6849CE]"
              />
            </div>
            <div className="flex-1 h-full flex items-center">
              <p className="text-[#1C3553] text-[0.8rem] font-medium">
                {route.label}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

{
  /* <div className="w-[80%] h-[100%] border-t-[1px] border-b-[1px] border-t-[#D0D5DD] border-b-[#D0D5DD] flex"> */
}

/*
   <div
   className="w-[30px] h-full absolute right-0"
   onClick={() => setShowSidebar((prev) => !prev)}
 >
   {showSidebar && (
     <Icon icon="lucide:menu" className="w-full h-full text-[#1C3553]" />
   )}
 </div>
*/
