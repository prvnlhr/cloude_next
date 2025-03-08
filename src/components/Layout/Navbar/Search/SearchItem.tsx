import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { FC } from "react";
import {
  SearchResult,
  FormattedFile,
  FormattedFolder,
  FormattedSharedItem,
} from "@/types/searchItemTypes";

interface SearchItemProps {
  item: FormattedFile | FormattedFolder | FormattedSharedItem;
  setSearchResults: React.Dispatch<React.SetStateAction<SearchResult>>;
}
const SearchItem: FC<SearchItemProps> = ({ item, setSearchResults }) => {
  const router = useRouter();

  const page = item.is_shared ? "shared" : "my-storage";
  const type = item.type === "folder" ? "folders" : "files";
  const linkUrl = `/cloude/home/${page}/${type}/${item.item_id}`;

  const handleItemClicked = () => {
    setSearchResults({
      files: [],
      folders: [],
      shared_items: [],
    });
    router.push(linkUrl);
  };

  return (
    <div className="w-full h-[60px] my-[10px] rounded-[8px] flex items-center border border-transparent hover:bg-[#F7FAFE]">
      <div className="h-[100%] aspect-square flex items-center justify-center">
        <div className="h-[80%] aspect-square flex items-center justify-center bg-[#F7F7F7] rounded-[10px]">
          <Icon
            icon={
              item.type === "folder" ? "solar:folder-bold" : "basil:file-solid"
            }
            className="w-[50%] h-[50%] text-[#88B1F5]"
          />
        </div>
      </div>
      <div className="h-full flex-grow flex flex-col items-start justify-center content-evenly overflow-hidden px-[5px]">
        <p className="w-[95%] text-[0.8rem] text-[#1C3553] font-medium whitespace-nowrap truncate">
          {item.name}
        </p>
        <div className="h-auto mt-[5px] w-auto flex items-center justify-center px-[8px] py-[2px] bg-[#DDE8FD] rounded">
          <p className="text-[#4B74D7] text-[0.55rem] font-bold p-0 m-0">
            {item.extension.toUpperCase()}
          </p>
        </div>
      </div>
      <div className="h-full aspect-square flex items-center justify-center">
        <button
          onClick={handleItemClicked}
          className="h-[60%] aspect-square flex items-center justify-center rounded-full border border-transparent bg-[#F7F7F7] hover:border hover:border-[#88B1F5]"
        >
          <Icon
            icon="lucide:arrow-up"
            className="w-[50%] h-[50%] rotate-45 text-[#88B1F5]"
          />
        </button>
      </div>
    </div>
  );
};

export default SearchItem;
