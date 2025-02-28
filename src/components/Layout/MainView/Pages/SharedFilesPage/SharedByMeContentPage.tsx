"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SharedByMeFolderCard from "./SharedByMeFolderCard";
import SharedByMeFileCard from "./SharedByMeFileCard";

const SharedByMeContentPage = ({ files, folders }) => {
  const pathname = usePathname();
  const getBasePath = () => {
    // Match base paths for all sections
    const match = pathname.match(
      /\/cloude\/home\/(my-storage|shared|starred|dashboard)/
    );
    return match ? match[0] : "";
  };

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

SharedByMeContentPage.defaultProps = {
  files: [],
  folders: [],
};
