"use client";
import FolderCard from "./FolderCard";
import FileCard from "./FileCard";
import { useState } from "react";
import DeleteModal from "./Modals/DeleteModal";
import ShareModal from "./Modals/ShareModal";
import RenameModal from "./Modals/RenameModal";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import SharedByMeContentPage from "../SharedByMeContent/SharedByMeContentPage";
import { File, Folder } from "@/types/contentTypes";

export type ContentPageProps = {
  files: File[];
  folders: Folder[];
};

type ActiveModal = {
  value: string;
  item: File | Folder | undefined;
  type: string;
};

const ContentPage: React.FC<ContentPageProps> = ({
  files = [],
  folders = [],
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isShareByMe = searchParams.get("myshared");

  const getBasePath = () => {
    const match = pathname.match(
      /\/cloude\/home\/(my-storage|shared|starred|dashboard)/
    );
    return match ? match[0] : "";
  };

  const basePath = getBasePath();
  const isSharedPage = basePath.split("/").includes("shared");

  const [activeModal, setActiveModal] = useState<ActiveModal>({
    value: "",
    item: undefined,
    type: "",
  });

  const onModalClose = () => {
    setActiveModal({
      value: "",
      item: undefined,
      type: "",
    });
  };

  return (
    <div
      className="w-full h-full flex flex-col overflow-y-scroll pb-[10px] pt-[20px]"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* If Shared Page, below tab bar will be shown*/}
      {isSharedPage && (
        <div className="w-full h-[40px] flex items-start border-b-[1px] border-b-[#EFEFEF]">
          <Link
            href={"/cloude/home/shared"}
            className={`ml-[2px] w-auto h-[1.875rem] flex items-center justify-center border-b ${
              !isShareByMe ? "border-b-[#1C3553]" : "border-b-0"
            } mr-[0.3125rem] px-[0.9375rem] text-${
              !isShareByMe ? "[#1C3553]" : "[#A2A8B2]"
            } text-[1rem] sm:text-[0.9rem] md:text-[0.875rem] lg:text-[0.9375rem] font-medium`}
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
                  <p className="text-[#1C3553] text-[1.2rem] sm:text-[1.2rem] md:text-[1.125rem] font-medium">
                    Folders
                  </p>
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
                  <p className="text-[#1C3553] text-[1.2rem] sm:text-[1.2rem] md:text-[1.125rem] font-medium">
                    Files
                  </p>
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
              />
            )}
            {activeModal?.value === "share" && (
              <ShareModal
                item={activeModal.item}
                itemType={activeModal.type}
                onClose={onModalClose}
              />
            )}
            {activeModal?.value === "rename" && (
              <RenameModal
                item={activeModal.item}
                itemType={activeModal.type}
                onClose={onModalClose}
              />
            )}
          </>
        )}
      </>
    </div>
  );
};

export default ContentPage;
