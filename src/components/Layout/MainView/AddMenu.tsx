import { FC, useRef, ChangeEvent, RefObject } from "react";
import { useParams } from "next/navigation";
import { uploadFiles } from "@/lib/services/user/filesService";
import useUserSession from "@/hooks/useUserSession";
import { Icon } from "@iconify/react/dist/iconify.js";
import { uploadFolder } from "@/lib/services/user/foldersService";
import { useToast } from "@/context/ToastContext";
import { processFolderInput } from "@/utils/folderProcessUtils";

interface AddMenuProps {
  menuRef: RefObject<HTMLDivElement | null>;
}

const AddMenu: FC<AddMenuProps> = ({ menuRef }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const { showToast } = useToast();

  const params = useParams();
  const session = useUserSession();

  let folderId: string | null = null;

  if (params.path) {
    const itemType = params.path[0];
    const itemId = params.path[1];
    if (itemType === "folders") {
      folderId = itemId;
    }
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const fileDataArray = fileArray.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size.toString(),
        file: file,
      }));
      const userId = session?.userId as string;
      try {
        await uploadFiles(fileDataArray, userId, folderId, showToast);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFolderUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const userId = session?.userId as string;
    const { foldersArray, filesArray } = processFolderInput(
      files,
      userId,
      folderId
    );

    try {
      const uploadFolderResponse = await uploadFolder(
        filesArray,
        foldersArray,
        userId,
        showToast
      );
      console.log(" uploadFolderResponse:", uploadFolderResponse);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`z-[50] w-auto h-[auto] flex flex-col absolute top-[75px] right-[20px] bg-white shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] p-[5px] rounded border`}
      ref={menuRef}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium  hover:bg-[#F6F6F6] px-[10px] rounded"
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
          className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium  hover:bg-[#F6F6F6] px-[10px] rounded"
        >
          <div className="h-full aspect-[1/2] flex items-center justify-center">
            <Icon
              icon="mingcute:folder-upload-line"
              className="w-[95%] h-[95%] text-[#1C3553]"
            />
          </div>
          <p className="text-[0.7rem] text-[#1C3553] ml-[9px]">Folder upload</p>
        </button>
        {/* <button
          type="button"
          className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium  hover:bg-[#F6F6F6] px-[10px] rounded"
        >
          <div className="h-full aspect-[1/2] flex items-center justify-center">
            <Icon
              icon="material-symbols:create-new-folder-outline-rounded"
              className="w-[95%] h-[95%] text-[#1C3553]"
            />
          </div>
          <p className="text-[0.7rem] text-[#1C3553] ml-[9px]">Create folder</p>
        </button> */}
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
