import useUserSession from "@/hooks/useUserSession";
import { deleteFile } from "@/lib/services/user/filesService";
import { deleteFolder } from "@/lib/services/user/foldersService";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Spinner } from "@heroui/spinner";

const DeleteModal = ({ item, itemType, onClose }) => {
  const key = itemType === "folder" ? "folder_name" : "file_name";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const session = useUserSession();
  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = session?.userId;

      const deleteResponse =
        itemType === "folder"
          ? await deleteFolder(userId, item.id)
          : await deleteFile(userId, item.id);

      // console.log(" deleteResponse:", deleteResponse);
      if (deleteResponse && deleteResponse.error) {
        throw new Error(deleteResponse.error);
      }
      setSuccess(true);
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message || `Failed to delete ${itemType}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
      w-[250px] h-auto 
      absolute top-1/2 left-1/2 transform -translate-x-[100%] -translate-y-1/2 
      bg-white border rounded-[8px] shadow-[rgba(50,50,93,0.25)_0px_50px_100px_-20px,rgba(0,0,0,0.3)_0px_30px_60px_-30px] z-[50] p-[10px]"
    >
      {/* Header */}
      <div className="w-full h-[30px] flex items-center justify-between">
        <p className="text-[0.9rem] text-[#1C3553] font-medium">
          Confirm to delete
        </p>
        <button
          onClick={onClose}
          type="button"
          className="w-[20px] border border-[#D0D5DD] h-[20px] rounded-full bg-[#E7EFFC] flex items-center justify-center"
        >
          <Icon
            icon="iconamoon:close-fill"
            className="w-[60%] h-[60%] text-[#1C3553]"
          />
        </button>
      </div>

      {/* Content */}
      <div className="w-full h-auto flex flex-col items-center mt-[10px]">
        <p className="text-[0.75rem] text-[#101828] font-medium mt-[10px]">
          Are you sure you want to delete this {itemType}?
        </p>
        <div className="w-full h-auto flex items-center justify-center p-2 mt-[5px] border-y-[1px] border-y-[#D0D5DD]">
          <p className="text-[0.75rem] text-[#737481] font-medium italic underline text-center break-words w-full">
            {item && item[key]}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full h-[30px] flex items-center justify-evenly mt-[10px]">
        <button
          onClick={onClose}
          type="button"
          className="w-[45%] h-[30px] text-[0.8rem] text-[#1C3553] font-medium rounded bg-[#FAFAFA] border border-[#D0D5DD] px-[15px]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="w-[45%] h-[30px] text-[0.8rem] text-white bg-red-700 rounded font-medium px-[15px] flex justify-center items-center"
        >
          {isLoading ? (
            <Spinner variant="gradient" color="default" size="sm" />
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
