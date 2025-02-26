import { Icon } from "@iconify/react/dist/iconify.js";

const DeleteModal = ({ item, itemType }) => {
  const key = itemType === "folder" ? "folder_name" : "file_name";
  return (
    <div
      className="
        w-[250px] h-auto 
        absolute top-1/2 left-1/2 transform -translate-x-[100%] -translate-y-1/2 
        bg-white border rounded-[8px] shadow-[rgba(50,50,93,0.25)_0px_50px_100px_-20px,rgba(0,0,0,0.3)_0px_30px_60px_-30px] z-[50]"
    >
      <div className="w-full h-[70px] flex items-center justify-center">
        <Icon icon="solar:trash-bin-2-linear" className="w-[65%] h-[65%]" />
      </div>
      <div className="w-full h-[50px] flex justify-center items-center flex-col">
        <p className="text-[0.9rem]  text-[#1C3553]  font-semibold">
          Are your want to
        </p>
        <p className="text-[0.9rem]  text-[#1C3553]  font-semibold">
          delete this {itemType}?
        </p>
      </div>
      <div className="w-full h-[40px] flex items-center justify-center">
        <p className="text-[#708090] text-[0.8rem] font-medium italic underline">
          {(item && item[key]) || ""}
        </p>
      </div>
      <div className="w-full h-[80px] flex items-center justify-center">
        <button className="w-auto h-[30px] mr-[8px] text-[0.8rem] text-[#1C3553] font-medium rounded bg-[#FAFAFA] border border-[#D0D5DD] px-[15px]">
          Cancel
        </button>
        <button className="w-auto h-[30px] ml-[8px] text-[0.8rem] text-white bg-red-700 rounded font-medium px-[15px]">
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
