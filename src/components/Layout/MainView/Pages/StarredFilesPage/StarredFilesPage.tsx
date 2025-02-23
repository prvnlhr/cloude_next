import { FC } from "react";
import { Outlet } from "react-router-dom";
import { useFolder } from "../../../../../context/FolderContext";

const StarredFilesPage = () => {
  const { getFolderContent } = useFolder();
  const { subFolders: folders, files } = getFolderContent("movies");
  return (
    <div className="w-full h-full flex ">
      <Outlet context={{ folders, files }} />
    </div>
  );
};

export default StarredFilesPage;
