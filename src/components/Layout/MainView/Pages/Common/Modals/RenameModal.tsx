import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const RenameModal = ({ item, itemType, onClose }) => {
  const [newName, setNewName] = useState("");
  const key = itemType === "folder" ? "folder_name" : "file_name";

  useEffect(() => {
    setNewName((item && item[key]) || "");
  }, [item]);

  return (
    <div
      className="w-[250px] h-auto  p-[10px]
    absolute top-1/2 left-1/2 transform -translate-x-[100%] -translate-y-1/2 
    bg-white border rounded-[8px] shadow-[rgba(50,50,93,0.25)_0px_50px_100px_-20px,rgba(0,0,0,0.3)_0px_30px_60px_-30px] z-[50]"
    >
      {/* Heading --------------- */}
      <div className="w-full h-[40px] flex items-center justify-between border-b-[1px] border-b-[#D0D5DD] mb-[10px]">
        <p className="text-[1.1rem]  text-[#1C3553]  font-semibold">
          Rename {itemType}
        </p>
        <button
          onClick={onClose}
          className="w-[20px] border border-[#D0D5DD] h-[20px] rounded-full bg-[#E7EFFC] flex items-center justify-center"
        >
          <Icon
            icon="iconamoon:close-fill"
            className="w-[60%] h-[60%] text-[#1C3553]"
          />
        </button>
      </div>

      {/* Input Group ----------------------------- */}
      <div className="w-full h-auto flex flex-col mt-[5px]">
        <div className="w-full h-[30px] flex items-center">
          <p className="text-[0.8rem]  text-[#A2A8B2]  font-medium">
            Enter new name
          </p>
        </div>
        <div className="w-full h-[40px]">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full h-full border border-[#D0D5DD] rounded-[5px] outline-none text-[0.8rem]  text-[#1C3553]  font-medium px-[5px]"
          />
        </div>
      </div>
      {/* Share button --------------------------------------*/}
      <div className="w-full h-[50px] flex items-center justify-end">
        <button className="w-auto h-[30px] px-[15px] rounded text-[0.8rem]  text-[#1C3553]  font-medium bg-[#E7EFFC]">
          Rename
        </button>
      </div>
    </div>
  );
};

export default RenameModal;
