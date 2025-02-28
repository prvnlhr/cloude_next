import { FC, useRef, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { uploadFiles } from "@/lib/services/user/filesService";
import useUserSession from "@/hooks/useUserSession";
import { Icon } from "@iconify/react/dist/iconify.js";
import { uploadFolder } from "@/lib/services/user/foldersService";

const getFileNameWithoutExtension = (fileName: string) => {
  return fileName.replace(/\.[^/.]+$/, "");
};

const AddMenu: FC = ({ menuRef }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const params = useParams();
  const session = useUserSession();

  let folderId: string | null = null;
  let fileId: string | null = null;

  if (params.path) {
    const itemType = params.path[0];
    const itemId = params.path[1];

    if (itemType === "folders") {
      folderId = itemId;
    } else if (itemType === "files") {
      fileId = itemId;
    }
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const fileDataArray = fileArray.map((file) => ({
        name: getFileNameWithoutExtension(file.name),
        type: file.type,
        size: file.size,
        file: file,
      }));
      const userId = session?.userId;
      try {
        const uploadFilesResponse = await uploadFiles(
          fileDataArray,
          userId,
          folderId
        );
        console.log("uploadFilesResponse:", uploadFilesResponse);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFolderUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const folderMap: Record<string, string> = {};

    const folders: Array<{
      id: string;
      name: string;
      parentFolderId: string | null;
      userId: string;
    }> = [];

    const filesArray: Array<{
      name: string;
      type: string;
      size: number;
      file: File;
      folderId: string | null;
      userId: string;
    }> = [];

    const userId = session?.userId;
    if (!userId) {
      console.error("User ID is missing. Please log in.");
      return;
    }

    const generateFolderId = () => {
      return crypto.randomUUID();
    };

    // Process each file
    Array.from(files).forEach((file) => {
      const pathParts = file.webkitRelativePath.split("/");
      const fileName = pathParts.pop();
      let parentFolderId: string | null = folderId;

      pathParts.forEach((folderName, index) => {
        const folderPath = pathParts.slice(0, index + 1).join("/");

        if (!folderMap[folderPath]) {
          const folderId = generateFolderId();
          folderMap[folderPath] = folderId;

          folders.push({
            id: folderId,
            name: folderName,
            parentFolderId: parentFolderId,
            userId: userId,
          });

          parentFolderId = folderId;
        } else {
          parentFolderId = folderMap[folderPath];
        }
      });

      filesArray.push({
        name: getFileNameWithoutExtension(fileName),
        type: file.type,
        size: file.size,
        file: file,
        folderId: parentFolderId,
        userId: userId,
      });
    });

    console.log(" filesArray:", filesArray);
    console.log(" folders:", folders);

    try {
      const uploadFolderResponse = await uploadFolder(
        filesArray,
        folders,
        userId
      );
      console.log(" uploadFolderResponse:", uploadFolderResponse);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`w-auto h-[auto] flex flex-col absolute top-[75px] right-[20px] bg-white shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] p-[5px] rounded border`}
      ref={menuRef}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium  hover:bg-[#EAECEB] px-[10px] rounded"
        >
          <div className="h-full aspect-[1/2] flex items-center justify-center">
            <Icon
              icon="mage:file-upload"
              className="w-[95%] h-[95%] text-[#1C3553]"
            />
          </div>
          <p className="text-[0.7rem] text-[#1C3553] ml-[9px]">File upload</p>
        </button>

        <button
          onClick={() => folderInputRef.current?.click()}
          className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium  hover:bg-[#EAECEB] px-[10px] rounded"
        >
          <div className="h-full aspect-[1/2] flex items-center justify-center">
            <Icon
              icon="mingcute:folder-upload-line"
              className="w-[95%] h-[95%] text-[#1C3553]"
            />
          </div>
          <p className="text-[0.7rem] text-[#1C3553] ml-[9px]">Folder upload</p>
        </button>
        <button
          type="button"
          className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium  hover:bg-[#EAECEB] px-[10px] rounded"
        >
          <div className="h-full aspect-[1/2] flex items-center justify-center">
            <Icon
              icon="material-symbols:create-new-folder-outline-rounded"
              className="w-[95%] h-[95%] text-[#1C3553]"
            />
          </div>
          <p className="text-[0.7rem] text-[#1C3553] ml-[9px]">Create folder</p>
        </button>
      </div>

      <>
        {/* Hidden inputs for file and folder */}
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
      </>
    </div>
  );
};

export default AddMenu;
