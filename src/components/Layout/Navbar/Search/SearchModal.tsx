import React from "react";
import SearchItem from "./SearchItem";
const SearchModal = ({ searchResults, setSearchResults }) => {
  const hasResults =
    searchResults.files.length > 0 ||
    searchResults.folders.length > 0 ||
    searchResults.shared_items.length > 0;
  return (
    <div
      className={`absolute top-[85px] left-1/2 sm:left-[5px] transform sm:translate-x-0 -translate-x-1/2
      z-[50] bg-white shadow-[0px_8px_24px_rgba(149,157,165,0.2)] 
      flex flex-col p-[15px] border 
      w-[90%] sm:w-[400px] 
      transition-all duration-300 ease-in-out overflow-hidden 
      ${hasResults ? "max-h-[400px]" : "max-h-0 opacity-0"}
    `}
    >
      <div className="w-full h-[50px] flex items-center border-b-[1px] border-[#EFEFEF]">
        <p className="text-[1rem] text-[#1C3553] font-medium">Search results</p>
      </div>

      <div
        className="w-full h-[calc(100%-50px)] overflow-y-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* files ------------------------- */}
        {searchResults.files.length > 0 && (
          <section className="w-full h-auto mt-[10px]">
            <div className="w-full h-[40px] flex items-center sticky top-0 z-10 bg-white border-b">
              <p className="text-[1rem] text-[#1C3553] font-medium">Files</p>
              <div className="h-[60%] aspect-square rounded flex items-center justify-center ml-[10px] bg-[#F4F6F6] border border-[#E4E7EC]">
                <p className="text-[0.7rem] text-[#1C3553] font-semibold">
                  {searchResults.files.length}
                </p>
              </div>
            </div>
            <div className="w-full flex-grow">
              {searchResults.files.map((item, index) => (
                <SearchItem
                  key={item.item_id}
                  item={item}
                  setSearchResults={setSearchResults}
                />
              ))}
            </div>
          </section>
        )}

        {/* folders ------------------------- */}
        {searchResults.folders.length > 0 && (
          <section className="w-full h-auto mt-[10px]">
            <div className="w-full h-[40px]  flex items-center sticky top-0 z-10 bg-white border-b">
              <p className="text-[1rem] text-[#1C3553] font-medium">Folders</p>
              <div className="h-[60%] aspect-square rounded flex items-center justify-center ml-[10px] bg-[#F4F6F6] border border-[#E4E7EC]">
                <p className="text-[0.7rem] text-[#1C3553] font-medium ">
                  {searchResults.folders.length}
                </p>
              </div>
            </div>
            <div className="w-full flex-grow">
              {searchResults.folders.map((item, index) => (
                <SearchItem
                  key={item.item_id}
                  item={item}
                  setSearchResults={setSearchResults}
                />
              ))}
            </div>
          </section>
        )}

        {/* shared ------------------------- */}
        {searchResults.shared_items.length > 0 && (
          <section className="w-full h-auto mt-[10px]">
            <div className="w-full h-[40px]  flex items-center  sticky top-0 z-10 bg-white border-b">
              <p className="text-[1rem] text-[#1C3553] font-medium">Shared</p>
              <div className="h-[60%] aspect-square rounded flex items-center justify-center ml-[10px] bg-[#F4F6F6] border border-[#E4E7EC]">
                <p className="text-[0.7rem] text-[#1C3553] font-medium ">
                  {searchResults.shared_items.length}
                </p>
              </div>
            </div>
            <div className="w-full flex-grow ">
              {searchResults.shared_items.map((item, index) => (
                <SearchItem
                  key={item.item_id}
                  item={item}
                  setSearchResults={setSearchResults}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
