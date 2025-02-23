import { FC } from "react";
import PageHeader from "./PageHeader";

type MainViewProps = {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const MainView: FC<MainViewProps> = ({
  children,
  showSidebar,
  setShowSidebar,
}) => {
  return (
    <div className="w-full h-[calc(100%-80px)] flex flex-col">
      <PageHeader showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="w-[100%] h-[calc(100%-70px)] px-[20px]">{children}</div>
    </div>
  );
};

export default MainView;
