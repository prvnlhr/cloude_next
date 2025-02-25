"use client";
import { shareContent } from "@/lib/services/shared/sharedService";
import { createClient } from "@/middlewares/supabase/client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ShareModal = () => {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [shareWithEmail, setShareWithEmail] = useState<string>(
    "mrtnmickae.jrl@gmail.com"
  );
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

  const handleShare = async () => {
    const itemId = searchParams.get("id");
    const itemType = searchParams.get("type");
    const userId = session?.userId;
    console.log(" shareWithEmail:", shareWithEmail);
    console.log(" itemType:", itemType);
    console.log(" itemId:", itemId);
    console.log(" userId:", userId);

    const shareContentData = {
      itemId,
      itemType,
      userId,
      shareWithEmail,
    };
    try {
      const shareResponse = await shareContent(shareContentData);
      console.log(shareResponse);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[300px] h-[auto] rounded absolute left-0 right-0 top-[20%] ml-auto mr-auto bg-white shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]">
      <div className="w-full h-[40px] flex items-center px-[10px]">
        <p className="font-medium text-[1rem] text-gray-800">Share</p>
      </div>
      <div className="w-full h-[auto] flex flex-col items-center justify-center px-[10px]">
        <input
          type="email"
          value={shareWithEmail}
          onChange={(e) => setShareWithEmail(e.target.value)}
          placeholder="Enter Email of the user"
          className="w-[100%] h-[40px] border border-blue-300 px-[5px] outline-none rounded placeholder:text-[0.8rem] focus:border-blue-500"
        />
        <button
          onClick={handleShare}
          type="button"
          className="w-[100px] h-[30px] rounded my-[20px] bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
