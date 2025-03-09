"use client";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
const BackBtn = () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  return (
    <button className="w-[30px] min-w-[30px] h-full flex items-center justify-center cursor-pointer ml-[8px] mr-[5px]">
      <Icon
        onClick={handleGoBack}
        icon="famicons:chevron-back"
        className="icon-class text-[#1C3553] w-[75%] h-[75%] mt-[1px] cursor-pointer"
      />
    </button>
  );
};

export default BackBtn;
