"use client";
import { getSignedUrl } from "@/actions/filesAction";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { File } from "@/types/contentTypes";
import { getFileIcon } from "@/utils/categoryUtils";

interface FilePageProps {
  file: File;
}

const FilePage: React.FC<FilePageProps> = ({ file }) => {
  const router = useRouter();
  const [signedUrl, setSignedUrl] = useState<string | undefined>(undefined);

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchSignedUrl = async () => {
      const url = await getSignedUrl(file.storage_path);
      setSignedUrl(url ?? undefined);
    };
    fetchSignedUrl();
  }, [file.storage_path]);

  const handleDownload = async () => {
    if (!signedUrl) return;

    try {
      const response = await fetch(signedUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", file.file_name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const getFilePreview = () => {
    const { file_type, file_name } = file;

    // Video
    if (file_type.startsWith("video/")) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <video controls className="w-auto h-full rounded-md shadow-lg">
            <source src={signedUrl} type={file_type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    // Audio
    else if (file_type.startsWith("audio/")) {
      return (
        <div className="w-full h-full flex items-center justify-center ">
          <audio controls className="w-[300px]">
            <source src={signedUrl} type={file_type} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
    // Images
    else if (file_type.startsWith("image/")) {
      return (
        <div className="h-[80%] aspect-video flex items-center justify-center relative">
          <Image
            src={signedUrl ?? "../../../../../../public/placeholder_image.jpg"}
            alt={file_name}
            fill={true}
            className="object-contain"
          />
        </div>
      );
    }
    // PDF
    else if (file_type === "application/pdf") {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <iframe
            src={signedUrl}
            className="w-full h-[80vh] rounded-md shadow-lg"
            title="PDF Preview"
          />
        </div>
      );
    }
    // Other Files - Show Download Button
    else {
      return (
        <div className="w-full h-full bg-white border border-[#E4E7EC] flex flex-col items-center justify-center">
          <div className="w-full h-[100px] flex justify-evenly items-center flex-col overflow-hidden">
            <p className="text-[1.5rem] text-[#1C3553] font-medium truncate">
              {file.file_name}
            </p>
            <p className="text-[0.9rem] text-[#4B74D7] font-medium border py-[5px] px-[10px] rounded bg-[#5b8ef424]">
              Preview not available
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="w-auto h-[30px] bg-[#5B8DF4] px-[10px] flex items-center rounded"
          >
            <Icon
              icon="material-symbols-light:download"
              className=" text-[white] h-[80%] w-[80%] mr-[5px]"
            />
            <p className="text-[0.8rem] text-[white] font-medium">Download</p>
          </button>
        </div>
      );
    }
  };

  return (
    <div className="fixed w-screen h-screen right-0 top-0 bg-[#F3F7FA] flex-col backdrop-blur-sm">
      <div className="w-full h-[70px] flex items-center justify-between border-b-[1px] border-b-[#EFEFEF]">
        <div className="w-auto h-full flex items-center">
          <button
            type="button"
            onClick={handleGoBack}
            className="h-[80%] aspect-[1/2] flex items-center justify-center ml-[10px]"
          >
            <Icon
              icon="famicons:chevron-back"
              className="text-[#1C3553] w-[80%] h-[80%] mt-[1px]"
            />
          </button>
          <div className="h-full w-[30px] flex items-center justify-center">
            <Icon
              icon={getFileIcon(file.file_name)}
              className="w-full h-full text-[#A2A8B2] mr-[5px]"
            />
          </div>
          <p className="text-[1.1rem] text-[#1C3553] font-medium ml-[2px]">
            {file.file_name}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="w-auto h-[30px] bg-[#5B8DF4] px-[10px] mr-[15px] flex items-center rounded"
        >
          <Icon
            icon="material-symbols-light:download"
            className=" text-[white] h-[80%] w-[80%] mr-[5px]"
          />
          <p className="text-[0.8rem] text-[white] font-medium">Download</p>
        </button>
      </div>
      <div className="w-full h-[calc(100%-70px)] flex items-center justify-center relative">
        <div className="w-[95%] sm:w-[60%] aspect-video flex items-center justify-center bg-[#F0F0F0] relative p-[5px]">
          {signedUrl && getFilePreview()}
        </div>
      </div>
    </div>
  );
};

export default FilePage;
