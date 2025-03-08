const DashboardLoading = () => {
  const columns = ["Name", "Type", "Activity", "Date"];
  return (
    <div
      className="w-full h-full pt-[20px] overflow-y-scroll"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* RecentUploaded Section --------------------------------------------------- */}
      <div className="w-full h-auto mb-[20px]">
        <section className="w-full h-full">
          <div className="w-full h-[40px]  flex items-start justify-start">
            <p className="text-[#1C3553] text-[1.2rem] font-medium">
              Recent Uploads
            </p>
          </div>
          <div
            className="w-full h-[calc(100%-40px)] flex items-center justify-start overflow-x-scroll"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="
                  h-[90%]
                  w-[170px]
                  min-w-[170px]
                  flex flex-col items-center bg-white 
                  p-[6px] my-[15px]
                  mx-[2.5%] sm:mx-[2.5%] md:mx-[1.5%] lg:mx-[1%]
                  rounded-[10px]
                  shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
                  hover:shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]
                  relative
                  animate-blink"
              >
                <div
                  className="w-full aspect-[3/2] bg-[#F7F7F7] flex justify-center items-end"
                  style={{
                    borderRadius: "inherit",
                  }}
                ></div>
                <div className="w-[95%] h-[80px] flex flex-col relative">
                  <div className="w-full h-[30px] flex items-end justify-start">
                    <div className="h-[60%] w-auto flex items-center justify-center px-[8px] bg-[#DDE8FD] rounded">
                      <div className="text-[#4B74D7] text-[0.6rem] font-bold p-0 m-0"></div>
                    </div>
                  </div>
                  <div className="w-full h-[50px] flex min-w-0 relative overflow-hidden">
                    <div className="h-full flex-grow flex flex-col items-start justify-evenly overflow-hidden">
                      <div className="w-[85%] ml-[10px] h-[5px] bg-[#F7F7F7]"></div>
                      <div className="w-[80%] ml-[10px] h-[5px] bg-[#F7F7F7]"></div>
                    </div>
                    <div className="h-full aspect-[1/1.4] flex-shrink-0 flex items-center justify-center relative">
                      <div className="w-[100%] aspect-square flex items-center  justify-center bg-[#F7F7F7] border-[#F0F0F0] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Categories Section --------------------------------------------------- */}
      <div className="w-full h-auto mb-[20px]">
        <section className="w-full h-full">
          <div className="w-full h-[40px] flex items-start justify-start]">
            <p className="text-[#1C3553] text-[1.2rem] font-medium">
              Categories
            </p>
          </div>
          <div
            className="w-full h-[calc(100%-40px)] flex flex-wrap overflow-x-scroll"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
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
                  <div className="h-full aspect-[1/1] flex-shrink-0 flex items-center justify-center relative">
                    <div className="w-[85%] aspect-square flex items-center  justify-center bg-[#F7F7F7] rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Activities Section --------------------------------------------------- */}
      <div className="w-full h-auto mb-[20px]">
        <section className="w-full h-auto">
          <div className="w-full h-[40px] flex items-start justify-start">
            <p className="text-[#1C3553] text-[1.2rem] font-medium">
              Activities
            </p>
          </div>
          <div className="w-full h-[calc(100%-40px)]">
            <div
              className="w-full h-full overflow-auto bg-white"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <table
                className="min-w-full border-collapse
                animate-blink"
              >
                {/* Table Head */}
                <thead className="bg-[#F7F7F7] sticky top-0 z-10 border-t-[1px] border-t-[#D0D5DD]">
                  <tr className="text-left text-[#1C3553] text-[0.8rem]">
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2 capitalize whitespace-nowrap border-x border-[#D0D5DD]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body - Skeleton Rows */}
                <tbody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <tr
                      key={index}
                      className="border border-[#D0D5DD] hover:bg-[#F7FAFE] text-[0.8rem]"
                    >
                      {/* Name with Icon */}
                      <td className="px-4 py-2 h-[50px] border border-[#D0D5DD] text-[#1C3553] overflow-hidden"></td>

                      {/* Type */}
                      <td className="px-4 py-2 border border-[#D0D5DD] whitespace-nowrap text-[#1C3553] font-medium"></td>

                      {/* Activity */}
                      <td className="px-4 py-2 border border-[#D0D5DD] whitespace-nowrap text-[#1C3553]"></td>

                      {/* Date */}
                      <td className="px-4 py-2 border border-[#D0D5DD] whitespace-nowrap text-[#1C3553] font-medium"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardLoading;
