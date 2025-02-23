import FolderCard from "./FolderCard";
import FileCard from "./FileCard";

// Types
interface Folder {
  folderId: string;
  folderName: string;
  parentFolderId: string | null;
}

interface File {
  fileId: string;
  fileName: string;
  folderId: string;
}

// Sample Folders Data
const foldersData: Folder[] = [
  {
    folderId: "b5e96b60-6f34-4d7d-9a4b-ff25158b9bb7",
    folderName: "Root Folder 1",
    parentFolderId: null,
  },
  {
    folderId: "3c2b2d45-d956-4d35-bc6c-7a9b58a88c3a",
    folderName: "Root Folder 2",
    parentFolderId: null,
  },
  {
    folderId: "a5d2e46c-e218-4b5a-b0a4-b22eae72b52c",
    folderName: "Documents",
    parentFolderId: "b5e96b60-6f34-4d7d-9a4b-ff25158b9bb7",
  },
  {
    folderId: "4c1b49d8-2d6e-49c2-8c97-d3a929a5c746",
    folderName: "Images",
    parentFolderId: "b5e96b60-6f34-4d7d-9a4b-ff25158b9bb7",
  },
  {
    folderId: "d7036ff2-2a99-49c9-8c21-476ad7b1653d",
    folderName: "Videos",
    parentFolderId: "b5e96b60-6f34-4d7d-9a4b-ff25158b9bb7",
  },
  {
    folderId: "1b9a9405-57c4-49f1-9675-2fa8f2322d8d",
    folderName: "Work",
    parentFolderId: "a5d2e46c-e218-4b5a-b0a4-b22eae72b52c",
  },
  {
    folderId: "9a79fabb-2225-441f-b7f6-7e7248f00ac0",
    folderName: "Personal",
    parentFolderId: "a5d2e46c-e218-4b5a-b0a4-b22eae72b52c",
  },
  {
    folderId: "58b262cd-e542-47c9-8128-11939a809f36",
    folderName: "Memes",
    parentFolderId: "4c1b49d8-2d6e-49c2-8c97-d3a929a5c746",
  },
  {
    folderId: "e7209a57-303a-43d4-803d-d12b1cd9f826",
    folderName: "Movies",
    parentFolderId: "d7036ff2-2a99-49c9-8c21-476ad7b1653d",
  },
];

// Sample Files Data
const filesData: File[] = [
  {
    fileId: "8be542c8-8d42-4e8f-bbff-6f98a37094d1",
    fileName: "rootFile1.txt",
    folderId: "b5e96b60-6f34-4d7d-9a4b-ff25158b9bb7",
  },
  {
    fileId: "f2c0d5b2-5b7f-4ad4-a3c7-65946572ff07",
    fileName: "resume.docx",
    folderId: "a5d2e46c-e218-4b5a-b0a4-b22eae72b52c",
  },
  {
    fileId: "e05956b7-07bc-4699-94c2-0b4fdb1252c5",
    fileName: "project.pdf",
    folderId: "a5d2e46c-e218-4b5a-b0a4-b22eae72b52c",
  },
  {
    fileId: "3b41dcdc-b22d-47d4-a8f5-032f4d0a3f29",
    fileName: "work_notes.txt",
    folderId: "1b9a9405-57c4-49f1-9675-2fa8f2322d8d",
  },
  {
    fileId: "25ec1c3a-2a0f-4428-8c55-e09a28e5c456",
    fileName: "diary.pdf",
    folderId: "9a79fabb-2225-441f-b7f6-7e7248f00ac0",
  },
  {
    fileId: "7a12cf07-fcfb-4506-b0b6-22536f85c1ef",
    fileName: "vacation.jpg",
    folderId: "4c1b49d8-2d6e-49c2-8c97-d3a929a5c746",
  },
  {
    fileId: "35a3b8b2-c905-42d2-88c1-4ad87498b3f2",
    fileName: "funny_meme.png",
    folderId: "58b262cd-e542-47c9-8128-11939a809f36",
  },
  {
    fileId: "54040e5b-0b11-4450-bcc0-7db94be5be22",
    fileName: "birthday.mp4",
    folderId: "d7036ff2-2a99-49c9-8c21-476ad7b1653d",
  },
  {
    fileId: "2495d58d-7d2b-4b58-a07b-06cc7f211f85",
    fileName: "inception.mp4",
    folderId: "e7209a57-303a-43d4-803d-d12b1cd9f826",
  },
];

const FolderPage = () => {
  return (
    <div
      className="w-full h-full flex flex-col overflow-y-scroll pb-[10px] pt-[20px]"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Folders section ------------------------------------------------------------------- */}
      <section className="w-full h-[auto] flex flex-col">
        <div className="w-full h-[40px] flex items-center justify-start">
          <p className="text-[#1C3553] font-medium">Folders</p>
        </div>
        <div className="w-full h-[auto]  py-[15px] flex flex-wrap">
          {foldersData.map((folder, index) => (
            <FolderCard key={index} folder={folder} />
          ))}
        </div>
      </section>

      {/* Files section --------------------------------------------------------------------- */}
      <section className="w-full h-[auto] flex flex-col">
        <div className="w-full h-[40px] flex items-center justify-start">
          <p className="text-[#1C3553] font-medium">Files</p>
        </div>
        <div className={`w-full h-[auto] flex flex-wrap`}>
          {filesData.map((file, index) => (
            <FileCard key={index} file={file} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default FolderPage;
