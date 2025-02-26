import { FC } from "react";
import PageHeader from "./PageHeader";

const MainView: FC = ({ children }) => {
  return (
    <div className="w-full h-[calc(100%-80px)] flex flex-col">
      <PageHeader />
      <div className="w-[100%] h-[calc(100%-70px)] px-[20px]">{children}</div>
    </div>
  );
};

export default MainView;
