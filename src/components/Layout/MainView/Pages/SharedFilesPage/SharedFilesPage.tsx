import { FC } from "react";
import { Outlet } from "react-router-dom";
import { useFolder } from "../../../../../context/FolderContext";

const SharedFilesPage: FC = () => {
  const { getFolderContent } = useFolder();
  const { subFolders: folders, files } = getFolderContent("videos");
  return (
    <div className="w-full h-full flex ">
      <Outlet context={{ folders, files }} />
    </div>
  );
};

export default SharedFilesPage;
