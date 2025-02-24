import { FC, useRef, ChangeEvent, useEffect, useState } from "react";
import { createClient } from "@/middlewares/supabase/client";
import { useParams } from "next/navigation";
import { uploadFiles } from "@/lib/services/user/filesService";
import { uploadFolder } from "@/lib/services/user/foldersService";

const UploadModal: FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const supabase = createClient();
  const params = useParams();

  let folderId: string | null = null;
  let fileId: string | null = null;

  if (params.path) {
    const itemType = params.path[0];
    const itemId = params.path[1];

    if (itemType === "folders") {
      folderId = itemId;
    } else if (itemType === "files") {
      fileId = itemId;
    }
  }

  const [session, setSession] = useState<{
    userName: string;
    email: string;
    userId: string;
  } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (data.user) {
          const { display_name, email } = data.user.user_metadata;
          setSession({
            userName: display_name,
            email,
            userId: data.user.id,
          });
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const { display_name, email } = session.user.user_metadata;
          setSession({
            userName: display_name,
            email,
            userId: session.user.id,
          });
        } else {
          setSession(null);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, [supabase.auth]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const fileDataArray = fileArray.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
      }));
      const userId = session?.userId;
      try {
        const uploadRes = await uploadFiles(fileDataArray, userId, folderId);
        console.log("uplaodRes modal", uploadRes);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFolderUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const folderMap: Record<string, string> = {}; // Maps folder paths to folder IDs

    const folders: Array<{
      id: string;
      name: string;
      parentFolderId: string | null;
      userId: string;
    }> = [];

    const filesArray: Array<{
      name: string;
      type: string;
      size: number;
      file: File; // The actual file object
      folderId: string | null;
      userId: string;
    }> = [];

    const userId = session?.userId;
    if (!userId) {
      console.error("User ID is missing. Please log in.");
      return;
    }

    // Helper function to generate a unique folder ID
    const generateFolderId = () => {
      return crypto.randomUUID(); // Use crypto.randomUUID() for unique IDs
    };

    // Process each file
    Array.from(files).forEach((file) => {
      const pathParts = file.webkitRelativePath.split("/");
      const fileName = pathParts.pop(); // Remove the file name
      let parentFolderId: string | null = null;

      // Traverse the folder structure
      pathParts.forEach((folderName, index) => {
        const folderPath = pathParts.slice(0, index + 1).join("/");

        if (!folderMap[folderPath]) {
          const folderId = generateFolderId();
          folderMap[folderPath] = folderId;

          // Add the folder to the folders array
          folders.push({
            id: folderId,
            name: folderName,
            parentFolderId: parentFolderId,
            userId: userId,
          });

          parentFolderId = folderId; // Update parentFolderId for the next level
        } else {
          parentFolderId = folderMap[folderPath]; // Use existing folder ID
        }
      });

      // Add the file to the files array
      filesArray.push({
        name: fileName,
        type: file.type,
        size: file.size,
        file: file, // The actual file object
        folderId: parentFolderId,
        userId: userId,
      });
    });

    console.log("Folders:", folders);
    console.log("Files:", filesArray);

    try {
      const folderUploadRes = await uploadFolder(filesArray, folders, userId);
      console.log(folderUploadRes);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[150px] h-[auto] flex flex-col absolute top-[75px] right-[20px] bg-white shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)] px-[0px]">
      {/* File upload button ------------------------------------------------------------- */}
      <button
        type="button"
        className="w-full h-[40px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]"
        onClick={() => fileInputRef.current?.click()}
      >
        File upload
      </button>

      {/* Folder upload button ------------------------------------------------------------- */}
      <button
        type="button"
        className="w-full h-[40px]  flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium border-b border-[#D0D5DD] px-[20px] hover:bg-[#F4F6F6]"
        onClick={() => {
          console.log("Button clicked");
          folderInputRef.current?.click();
        }}
      >
        Folder upload
      </button>

      {/* Create new folder button ------------------------------------------------------------- */}
      <button
        type="button"
        className="w-full h-[40px]  flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium px-[20px] hover:bg-[#F4F6F6]"
      >
        Create folder
      </button>

      {/* Hidden inputs for file and folder selection ------------------------------------------- */}

      <input
        type="file"
        ref={fileInputRef}
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      <input
        type="file"
        multiple
        ref={(ref) => {
          if (ref) {
            ref.setAttribute("webkitdirectory", "");
          }
          folderInputRef.current = ref;
        }}
        onChange={handleFolderUpload}
        className="hidden"
      />
    </div>
  );
};

export default UploadModal;
