// import { Outlet, useParams } from "react-router-dom";
// import { useFolder } from "../../../../../context/FolderContext";

const MyStoragePage = () => {
  // const params = useParams();
  // const { getFolderContent } = useFolder();
  // const { fileId, folderId } = params;
  // console.log(" fileId:", fileId);
  // console.log(" folderId:", folderId);
  // const { subFolders: folders, files } = getFolderContent(folderId?.toString());

  return (
    <div className="w-full h-full flex">
      {/* <Outlet context={{ folders, files }} /> */}
    </div>
  );
};

export default MyStoragePage;
