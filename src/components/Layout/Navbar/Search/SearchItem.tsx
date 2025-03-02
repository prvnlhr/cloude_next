import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { FC } from "react";

const SearchItem: FC = ({ item, setSearchResults }) => {
  const router = useRouter();

  const page = item.is_shared ? "shared" : "my-storage";
  const type = item.type === "folder" ? "folders" : "files";
  const linkUrl = `/cloude/home/${page}/${type}/${item.item_id}`;

  const handleItemClicked = () => {
    setSearchResults((prev) => ({
      files: [],
      folders: [],
      shared_items: [],
    }));
    router.push(linkUrl);
  };

  return (
    <div className="w-full h-[60px] my-[10px] rounded flex items-center border border-transparent hover:border-[#D0D5DD] hover:bg-[#FAFAFA]">
      <div className="h-[100%] aspect-square flex items-center justify-center">
        <div className="h-[70%] aspect-square flex items-center justify-center bg-[#E7EFFC] rounded">
          <Icon
            icon={
              item.type === "folder" ? "mdi-light:folder" : "mdi-light:file"
            }
            className="w-[50%] h-[50%] text-[#1C3553]"
          />
        </div>
      </div>
      <div className="h-full flex-grow flex flex-col items-start justify-center content-evenly overflow-hidden px-[5px]">
        <p className="w-[95%] text-[0.8rem] text-[#1C3553] font-medium whitespace-nowrap truncate">
          {item.name}
        </p>
        <p className="max-w-[90%] text-[0.8rem] text-[#1C3553] italic">
          Type: {item.extension}
        </p>
      </div>
      <div className="h-full aspect-square flex items-center justify-center">
        <button
          onClick={handleItemClicked}
          className="h-[60%] aspect-square border flex items-center justify-center rounded-full bg-[#F4F6F6]"
        >
          <Icon
            icon="iconoir:arrow-up"
            className="w-[50%] h-[50%] rotate-45 text-[#1C3553]"
          />
        </button>
      </div>
    </div>
  );
};

export default SearchItem;
