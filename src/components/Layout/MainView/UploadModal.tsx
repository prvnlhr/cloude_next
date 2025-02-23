import { FC, useRef, ChangeEvent } from "react";

const UploadModal: FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  // const params = useParams();
  // const dispatch = useAppDispatch();

  // const { user_id } = useSession();
  // const folderId = params.folderId || null;

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    // const files = e.target.files;
    // if (files) {
    //   const fileArray = Array.from(files);
    //   const fileData = fileArray.map((file) => ({
    //     name: file.name,
    //     type: file.type,
    //     size: file.size,
    //     file: file,
    //   }));
    //   dispatch(
    //     uploadFiles({
    //       newFiles: fileData,
    //       userId: user_id,
    //       folderId: folderId,
    //     })
    //   );
    // }
  };

  const handleFolderUpload = (e: ChangeEvent<HTMLInputElement>) => {
    // const files = e.target.files;
    // const folderMap: Record<string, string> = {}; // To map folder paths to IDs
    // const folders: Array<{
    //   name: string;
    //   parentFolderId: string | null;
    //   userId: string;
    // }> = [];
    // const filesArray: Array<{
    //   name: string;
    //   size: number;
    //   folderId: string | null;
    //   userId: string;
    // }> = [];
    // Array.from(files).forEach((file) => {
    //   const pathParts = file.webkitRelativePath.split("/");
    //   pathParts.pop(); // Remove the file name
    //   let currentPath = "";
    //   let parentFolderId: string | null = null;
    //   pathParts.forEach((folderName) => {
    //     currentPath += `${folderName}/`;
    //     // If this folder hasn't been recorded yet
    //     if (!folderMap[currentPath]) {
    //       const folderId = `${folderName}_${Math.random().toString(36).substr(2, 9)}`; // Temporary ID
    //       folderMap[currentPath] = folderId;
    //       folders.push({
    //         name: folderName,
    //         parentFolderId: parentFolderId,
    //         userId: user_id,
    //       });
    //       parentFolderId = folderId; // Set the parent for the next folder level
    //     } else {
    //       parentFolderId = folderMap[currentPath]; // Get the existing ID
    //     }
    //   });
    //   // Store the file with its corresponding folder ID
    //   filesArray.push({
    //     name: file.name,
    //     size: file.size,
    //     folderId: parentFolderId,
    //     userId: user_id,
    //   });
    // });
    // console.log("Folders:", folders);
    // console.log("Files:", filesArray);
  };

  return (
    <div className="w-[150px] h-[auto] flex flex-col absolute top-[75px] right-[20px] bg-white shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)] px-[0px]">
      {/* File upload button ------------------------------------------------------------- */}
      <button
        type="button"
        className="w-full h-[40px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]"
        onClick={() => fileInputRef.current?.click()}
      >
        File upload
      </button>

      {/* Folder upload button ------------------------------------------------------------- */}
      <button
        type="button"
        className="w-full h-[40px]  flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium border-b border-[#D0D5DD] px-[20px] hover:bg-[#F4F6F6]"
        onClick={() => {
          console.log("Button clicked");
          folderInputRef.current?.click();
        }}
      >
        Folder upload
      </button>

      {/* Create new folder button ------------------------------------------------------------- */}
      <button
        type="button"
        className="w-full h-[40px]  flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]"
      >
        Create folder
      </button>

      {/* Hidden inputs for file and folder selection ------------------------------------------- */}

      <input
        type="file"
        ref={fileInputRef}
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      <input
        type="file"
        multiple
        ref={(ref) => {
          if (ref) {
            ref.setAttribute("webkitdirectory", "");
          }
          folderInputRef.current = ref;
        }}
        onChange={handleFolderUpload}
        className="hidden"
      />
    </div>
  );
};

export default UploadModal;
