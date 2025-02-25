"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import {
  addToStarred,
  removeFromStarred,
} from "@/lib/services/starred/starredService";
import { createClient } from "@/middlewares/supabase/client";

interface Folder {
  folderId: string;
  folderName: string;
}

interface FolderCardProps {
  folder: Folder;
  basePath: string;
}

const FolderCard = ({ folder, basePath }: FolderCardProps) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${pathname}?${new URLSearchParams({
    share: "true",
    type: "folder",
    id: folder?.id,
  })}`;
  const supabase = createClient();

  const [session, setSession] = useState<{
    userName: string;
    email: string;
    userId: string;
  } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (data.user) {
          const { display_name, email } = data.user.user_metadata;
          setSession({
            userName: display_name,
            email,
            userId: data.user.id,
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

  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleMarkStar = async () => {
    try {
      const userId = session?.userId;
      const markItemData = {
        itemType: "folder",
        itemId: folder?.id,
        userId: userId,
      };
      const markStarResponse = await addToStarred(markItemData);
      console.log(" markStarResponse:", markStarResponse);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveStar = async () => {
    try {
      const itemId = folder?.id;
      const userId = session?.userId;
      const itemType = "folder";

      const removeResponse = await removeFromStarred(itemId, itemType, userId);
      console.log(" removeResponse:", removeResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-[40px] mx-[1%] my-[15px] flex border border-[#E4E7EC] bg-[#F4F6F6] rounded-[8px]">
      <Link
        href={`${basePath}/folders/${folder.id}`}
        className="h-full flex-1  flex items-center justify-start"
      >
        <div className="h-full aspect-square flex items-center justify-center">
          <Icon
            icon="solar:folder-linear"
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
        </div>
        <div className="h-full flex-1 flex max-w-[100px] items-center overflow-hidden">
          <p className="text-[#1C3553] text-[0.75rem] font-medium  whitespace-nowrap truncate">
            {folder?.folder_name}
          </p>
        </div>
      </Link>
      <div className="h-full aspect-square flex items-center justify-center relative">
        <button
          onClick={toggleMenu}
          type="button"
          className="w-full h-full flex items-center justify-center"
        >
          <Icon
            icon="qlementine-icons:menu-dots-16"
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
        </button>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="w-[150px] h-[auto] flex flex-col absolute top-[46px] -right-[100%] bg-white shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)] px-[0px]"
          >
            <button className="w-full h-[40px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]">
              <p>Rename</p>
            </button>
            <Link
              href={shareUrl}
              className="w-full h-[40px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]"
            >
              <p>Share</p>
            </Link>
            <button
              type="button"
              className="w-full h-[40px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]"
            >
              <p>Delete</p>
            </button>
            <button
              onClick={
                folder?.is_starred === true ? handleRemoveStar : handleMarkStar
              }
              type="button"
              className="w-full h-[40px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]"
            >
              {folder?.is_starred === true ? (
                <p className="whitespace-nowrap">Remove from Starred</p>
              ) : (
                <p>Add to Starred</p>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderCard;
