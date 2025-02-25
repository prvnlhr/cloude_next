import FolderCard from "./FolderCard";
import FileCard from "./FileCard";
import { headers } from "next/headers";
import ShareModal from "./ShareModal";

const FolderPage = async ({ files, folders, searchParams }) => {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const basePath = pathname?.replace(/\/folders\/[^/]+$/, "") || "";
  const searchParamsObj = (await searchParams) || {};
  // console.log("searchParamsObj", searchParamsObj);

  return (
    <div
      className="w-full h-full flex flex-col overflow-y-scroll pb-[10px] pt-[20px] relative"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Folders section ------------------------------------------------------------------- */}

      {folders.length > 0 && (
        <section className="w-full h-[auto] flex flex-col">
          <div className="w-full h-[40px] flex items-center justify-start">
            <p className="text-[#1C3553] font-medium">Folders</p>
          </div>
          <div className="w-full h-[auto]  py-[15px] flex flex-wrap">
            {folders.map((folder, index) => (
              <FolderCard key={index} folder={folder} basePath={basePath} />
            ))}
          </div>
        </section>
      )}

      {/* Files section --------------------------------------------------------------------- */}
      {files.length > 0 && (
        <section className="w-full h-[auto] flex flex-col">
          <div className="w-full h-[40px] flex items-center justify-start">
            <p className="text-[#1C3553] font-medium">Files</p>
          </div>
          <div className={`w-full h-[auto] flex flex-wrap`}>
            {files.map((file, index) => (
              <FileCard key={index} file={file} basePath={basePath} />
            ))}
          </div>
        </section>
      )}
      {Object.keys(searchParamsObj).length > 0 && searchParamsObj.share && (
        <ShareModal />
      )}
    </div>
  );
};

export default FolderPage;

FolderPage.defaultProps = {
  files: [],
  folders: [],
};
