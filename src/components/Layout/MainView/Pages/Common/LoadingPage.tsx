const LoadingFolderCard = () => {
  return (
    <div
      className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-auto 
        mx-[1%] my-[15px] 
        bg-[#F6F6F6] border-[1px] border-[#E4E7EC] 
        flex
        justify-between  
        rounded-[10px]
        min-h-[40px]
        relative
        z-[4]
        cursor-pointer
        shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
        animate-pulse"
    >
      <div className="w-full h-[40px] flex justify-between">
        <div className="w-auto h-full flex overflow-hidden">
          <div className="h-full flex-grow flex items-center justify-start overflow-hidden">
            <div className="w-[100px] rounded-2xl h-[50%] bg-white bg-opacity-60 ml-[8px]"></div>
          </div>
        </div>
        <div className="h-full w-[40px] min-w-[40px] flex items-center justify-center cursor-pointer">
          <div className="w-[60%] rounded aspect-square bg-white bg-opacity-60 ml-[8px]"></div>
        </div>
      </div>
    </div>
  );
};

const LoadingFileCard = () => {
  return (
    <div
      className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-auto 
        mx-[1%] my-[15px] 
        bg-[#F6F6F6] border-[1px] border-[#E4E7EC] 
        flex flex-col 
        rounded-[10px]
        min-h-[45px]
        relative
        shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
        animate-pulse"
    >
      <div className="w-full h-[auto] flex flex-col">
        <div className="w-full aspect-[2/1.5] flex items-end justify-center cursor-pointer overflow-hidden p-[8px]">
          <div
            className="w-[100%] h-[100%] bg-white bg-opacity-60 
              flex items-center justify-center overflow-hidden relative"
          ></div>
        </div>
        <div className="w-full h-[45px] flex">
          <div className="h-full aspect-square flex-grow overflow-hidden flex items-center justify-start ">
            <div className="w-[70%] rounded-2xl h-[30%] bg-white bg-opacity-60 ml-[8px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingPage = () => {
  return (
    <div
      className="w-full h-full flex flex-col overflow-y-scroll pb-[10px] pt-[20px]"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <section className="w-full h-[auto] flex flex-col">
        <div className="w-full h-[40px] flex items-center justify-start">
          <p className="text-[#1C3553] font-medium">Folders</p>
        </div>
        <div className="w-full h-[auto] py-[15px] flex flex-wrap">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingFolderCard key={index} />
          ))}
        </div>
      </section>

      <section className="w-full h-[auto] flex flex-col">
        <div className="w-full h-[40px] flex items-center justify-start">
          <p className="text-[#1C3553] font-medium">Files</p>
        </div>
        <div className="w-full h-[auto] flex flex-wrap">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingFileCard key={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LoadingPage;
