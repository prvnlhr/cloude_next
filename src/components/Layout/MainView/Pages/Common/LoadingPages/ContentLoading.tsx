const LoadingFolderCard = () => {
  return (
    <div
      className="w-[45%] sm:w-[45%] md:w-[30%] lg:w-[18%] h-auto 
        flex flex-col items-center bg-white 
        p-[6px] my-[15px]
        mx-[2.5%] sm:mx-[2.5%] md:mx-[1.5%] lg:mx-[1%]
        rounded-[10px]
        shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
        hover:shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]
        relative
        animate-blink
        "
    >
      <div className="w-full h-[40px] flex items-start justify-start rounded-[10px]">
        <div
          className="h-full aspect-square bg-[#F7F7F7] flex items-center justify-center"
          style={{
            borderRadius: "inherit",
          }}
        ></div>
        <div className="h-full flex-grow min-w-0 flex flex-col justify-evenly">
          <div className="w-[85%] ml-[10px] h-[5px] bg-[#F7F7F7]"></div>
          <div className="w-[80%] ml-[10px] h-[5px] bg-[#F7F7F7]"></div>
        </div>
        <div className="h-full aspect-[1/1.5] flex-shrink-0 flex items-center justify-center relative">
          <div className="w-[100%] aspect-square flex items-center  justify-center bg-[#F2F2F2] border-[#F0F0F0] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const LoadingFileCard = () => {
  return (
    <div
      className="w-[45%] sm:w-[45%] md:w-[30%] lg:w-[18%] h-auto 
        flex flex-col items-center bg-white 
        p-[6px] my-[15px]
        mx-[2.5%] sm:mx-[2.5%] md:mx-[1.5%] lg:mx-[1%]
        rounded-[10px]
        shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
        hover:shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]
        relative
        animate-blink
        "
    >
      <div
        className="w-full aspect-[3/2] bg-[#F7F7F7] flex justify-center items-end "
        style={{
          borderRadius: "inherit",
        }}
      ></div>
      <div className="w-[95%] h-[80px] flex flex-col relative">
        <div className="w-full h-[30px] flex items-end justify-start">
          <div className="h-[70%] w-auto flex items-center justify-center px-[8px] bg-[#DDE8FD] rounded ">
            <p className="text-[#4B74D7] text-[0.6rem] font-bold p-0 m-0"></p>
          </div>
        </div>
        <div className="w-full h-[50px] flex min-w-0 relative">
          <div className="h-full flex-grow flex flex-col items-start justify-evenly overflow-hidden">
            <div className="bg-[#F7F7F7] w-[90%] h-[10px] "></div>
            <div className="bg-[#F7F7F7] w-[80%] h-[10px] "></div>
          </div>
          <div className="h-full aspect-[1/1.8] flex-shrink-0 flex items-center justify-end relative">
            <div className="w-[100%] aspect-square flex items-center  justify-center bg-[#F2F2F2] border-[#F0F0F0] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentLoading = () => {
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

export default ContentLoading;
