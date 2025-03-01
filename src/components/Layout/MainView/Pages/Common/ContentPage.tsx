"use client";
import FolderCard from "./FolderCard";
import FileCard from "./FileCard";
// import { headers } from "next/headers";
import { useEffect, useState } from "react";
import DeleteModal from "./Modals/DeleteModal";
import ShareModal from "./Modals/ShareModal";
import RenameModal from "./Modals/RenameModal";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import SharedByMeContentPage from "../SharedFilesPage/SharedByMeContentPage";

const ContentPage = ({ files, folders }) => {
  // const headerList = await headers();
  // const pathname = headerList.get("x-current-path");
  // const basePath = pathname?.replace(/\/folders\/[^/]+$/, "") || "";
  // const searchParamsObj = (await searchParams) || {};
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isShareByMe = searchParams.get("myshared");
  // console.log(" myshared:", myshared);

  const getBasePath = () => {
    // Match base paths for all sections
    const match = pathname.match(
      /\/cloude\/home\/(my-storage|shared|starred|dashboard)/
    );
    return match ? match[0] : "";
  };

  const basePath = getBasePath();
  const isSharedPage = basePath.split("/").includes("shared");

  const [activeModal, setActiveModal] = useState({
    value: "",
    item: undefined,
  });

  const onModalClose = () => {
    setActiveModal({
      value: "",
      item: undefined,
    });
  };
  useEffect(() => {
    // console.log(activeModal);
  }, [activeModal]);

  return (
    <div
      className="w-full h-full flex flex-col overflow-y-scroll pb-[10px] pt-[20px]"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {isSharedPage && (
        <div className="w-full h-[40px] flex items-start border-b-[1px] border-b-[#D0D5DD]">
          <Link
            href={"/cloude/home/shared"}
            className={`w-auto h-[30px]  flex items-center justify-center border-b-[${
              !isShareByMe ? 1 : 0
            }px] border-b-[#1C3553] mr-[5px] px-[15px] text-[${
              !isShareByMe ? "#1C3553" : "#A2A8B2"
            }] text-[0.8rem] font-medium`}
          >
            Shared with Me
          </Link>
          <Link
            href={`${basePath}?myshared=true`}
            className={`w-auto h-[30px] flex items-center justify-center border-b-[${
              isShareByMe ? 1 : 0
            }px] border-b-[#1C3553] ml-[10px] px-[15px] text-[${
              isShareByMe ? "#1C3553" : "#A2A8B2"
            }] text-[0.8rem] font-medium`}
          >
            Shared by Me
          </Link>
        </div>
      )}

      <>
        {isSharedPage && isShareByMe ? (
          <SharedByMeContentPage files={files} folders={folders} />
        ) : (
          <>
            {folders?.length > 0 && (
              <section className="w-full h-[auto] flex flex-col">
                <div className="w-full h-[40px] flex items-center justify-start">
                  <p className="text-[#1C3553] font-medium">Folders</p>
                </div>
                <div className="w-full h-[auto]  py-[15px] flex flex-wrap">
                  {folders?.map((folder, index) => (
                    <FolderCard
                      key={index}
                      folder={folder}
                      setActiveModal={setActiveModal}
                    />
                  ))}
                </div>
              </section>
            )}
            {files.length > 0 && (
              <section className="w-full h-[auto] flex flex-col">
                <div className="w-full h-[40px] flex items-center justify-start">
                  <p className="text-[#1C3553] font-medium">Files</p>
                </div>
                <div className={`w-full h-[auto] flex flex-wrap`}>
                  {files.map((file, index) => (
                    <FileCard
                      key={index}
                      file={file}
                      setActiveModal={setActiveModal}
                    />
                  ))}
                </div>
              </section>
            )}
            {activeModal?.value === "delete" && (
              <DeleteModal
                item={activeModal.item}
                itemType={activeModal.type}
                onClose={onModalClose}
                handlerFunction={() => console.log("Delete")}
              />
            )}
            {activeModal?.value === "share" && (
              <ShareModal
                item={activeModal.item}
                itemType={activeModal.type}
                onClose={onModalClose}
                handlerFunction={() => console.log("Share")}
              />
            )}
            {activeModal?.value === "rename" && (
              <RenameModal
                item={activeModal.item}
                itemType={activeModal.type}
                onClose={onModalClose}
                handlerFunction={() => console.log("Rename")}
              />
            )}
          </>
        )}
      </>
    </div>
  );
};

export default ContentPage;

ContentPage.defaultProps = {
  files: [],
  folders: [],
};
