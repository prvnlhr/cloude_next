"use client";
import SharedByMeFolderCard from "./SharedByMeFolderCard";
import SharedByMeFileCard from "./SharedByMeFileCard";
import { File, Folder } from "@/types/contentTypes";

export type SharedByMeContentPageProps = {
  files: File[];
  folders: Folder[];
};
const SharedByMeContentPage: React.FC<SharedByMeContentPageProps> = ({
  files,
  folders,
}) => {
  return (
    <div
      className="w-full h-full flex flex-col overflow-y-scroll pb-[10px] pt-[20px]"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Folders section ------------------------------------------------------------------- */}
      {folders?.length > 0 && (
        <section className="w-full h-[auto] flex flex-col">
          <div className="w-full h-[40px] flex items-center justify-start">
            <p className="text-[#1C3553] font-medium">Folders</p>
          </div>
          <div className="w-full h-[auto]  py-[15px] flex flex-wrap">
            {folders.map((folder, index) => (
              <SharedByMeFolderCard key={index} folder={folder} />
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
              <SharedByMeFileCard key={index} file={file} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SharedByMeContentPage;
