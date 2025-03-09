import React from "react";

const NoContent = () => {
  return (
    <div className="w-full h-[80%] flex items-center flex-col justify-center">
      <div
        className="w-[45%] sm:w-[45%] md:w-[30%] lg:w-[18%] h-auto 
    flex flex-col items-center bg-white 
    p-[6px] my-[15px]
    mx-[2.5%] sm:mx-[2.5%] md:mx-[1.5%] lg:mx-[1%]
    rounded-[10px]
    shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
    hover:shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]
    relative
    lg:-translate-x-1/2
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

      <p className="text-[1.2rem] mt-[5px] font-semibold text-[#1C3553]  lg:-translate-x-1/3">
        Oops! Looks a little empty here.
      </p>
      <p className="text-[0.8rem] mt-[5px] font-medium text-[#A2A8B2] lg:-translate-x-1/2">
        Start uploading to view your data
      </p>
    </div>
  );
};

export default NoContent;
