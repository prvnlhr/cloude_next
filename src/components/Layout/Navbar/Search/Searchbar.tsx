"use client";
import { FC, useState, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { searchItem } from "@/lib/services/user/searchServices";
import useUserSession from "@/hooks/useUserSession";
import { useDebounce } from "@/hooks/useDebounce";
import SearchModal from "./SearchModal";
import { Spinner } from "@heroui/spinner";
import { SearchResult } from "@/types/searchItemTypes";

const Searchbar: FC = () => {
  const session = useUserSession();
  const userId = session?.userId as string;
  const [searchKey, setSearchKey] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [searchResults, setSearchResults] = useState<SearchResult>({
    files: [],
    folders: [],
    shared_items: [],
  });

  const debouncedSearch = useDebounce(async (key: string) => {
    const trimmedKey = key.trim();

    if (trimmedKey) {
      setIsSearching(true);
      try {
        const results = await searchItem(userId, key);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults({ files: [], folders: [], shared_items: [] });
    }
  }, 500);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKey(e.target.value);
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const clearResults = () => {
    setSearchResults({ files: [], folders: [], shared_items: [] });
    setSearchKey("");
  };

  const hasResults =
    searchResults.files.length > 0 ||
    searchResults.folders.length > 0 ||
    searchResults.shared_items.length > 0;

  return (
    <div className="w-[250px] rounded-[5px] h-[35px] ml-[20px] flex items-center border-[1px] border-[#D0D5DD]">
      <div className="h-full flex-grow px-[10px] flex items-center">
        <input
          className="w-full h-full outline-none bg-transparent text-[#1C3553] text-[0.85rem] sm:text-[0.9rem] md:text-[0.95rem] lg:text-[1rem] font-medium placeholder:text-[#A2A8B2] placeholder:text-[0.7rem] sm:placeholder:text-[0.75rem] md:placeholder:text-[0.8rem] lg:placeholder:text-[0.85rem] placeholder:font-medium"
          placeholder="Search items by name or file extension"
          value={searchKey}
          onChange={handleSearch}
        />
      </div>
      <div className="h-full aspect-square flex-shrink-0 flex items-center justify-center">
        {isSearching ? (
          <Spinner variant="gradient" color="primary" size="sm" />
        ) : (
          <Icon
            onClick={clearResults}
            icon={hasResults ? "iconamoon:close-duotone" : "mynaui:search"}
            className="w-[65%] h-[65%] text-[#336CF3] cursor-pointer"
          />
        )}
      </div>
      <SearchModal
        searchResults={searchResults}
        setSearchResults={setSearchResults}
      />
    </div>
  );
};

export default Searchbar;
