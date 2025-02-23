import FileCard from "./FileCard";
import FolderCard from "./FolderCard";

const FilesFolderPage = ({ files, folders }) => {
  return (
    <div
      className="w-full h-full flex flex-col overflow-y-scroll pb-[10px] pt-[20px]"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Folders section ------------------------------------------------------------------- */}
      <section className="w-full h-[auto] flex flex-col">
        <div className="w-full h-[40px] flex items-center justify-start">
          <p className="text-[#1C3553] font-medium">Folders</p>
        </div>
        <div className="w-full h-[auto]  py-[15px] flex flex-wrap">
          {folders.map((folder, index) => (
            <FolderCard key={index} folder={folder} />
          ))}
        </div>
      </section>

      {/* Files section --------------------------------------------------------------------- */}
      <section className="w-full h-[auto] flex flex-col">
        <div className="w-full h-[40px] flex items-center justify-start">
          <p className="text-[#1C3553] font-medium">Files</p>
        </div>
        <div className={`w-full h-[auto] flex flex-wrap`}>
          {files.map((file, index) => (
            <FileCard key={index} file={file} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default FilesFolderPage;
