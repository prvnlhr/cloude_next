import { FC, ReactNode } from "react";
import PageHeader from "./PageHeader";

interface MainViewProps {
  children: ReactNode;
}
const MainView: FC<MainViewProps> = ({ children }) => {
  return (
    <div className="w-full h-[calc(100%-80px)] flex flex-col relative">
      <PageHeader />
      <div className="w-[100%] h-[calc(100%-70px)] px-[20px]">{children}</div>
    </div>
  );
};

export default MainView;
