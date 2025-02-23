"use client";
import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";
import MainView from "./MainView/MainView";
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  return (
    <div className="w-[100%] h-[100%]  overflow-hidden relative border border-white bg-white">
      <div
        className={`
        flex h-full transition-transform duration-300
        ${showSidebar ? "translate-x-0" : "-translate-x-1/2"}
        lg:translate-x-0 w-[200%] lg:w-full
        `}
      >
        <div className="w-[50%] lg:w-[20%] h-full relative flex">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        </div>
        <div className="w-[50%] lg:w-[80%] h-full relative">
          <Navbar />
          <MainView showSidebar={showSidebar} setShowSidebar={setShowSidebar}>
            {children}
          </MainView>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
