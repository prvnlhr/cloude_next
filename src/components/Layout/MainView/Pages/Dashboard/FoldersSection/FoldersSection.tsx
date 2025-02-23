import FolderCard from "./FolderCard";

type Folder = {
  foldername: string;
  src: string;
};

const folders: Folder[] = [
  { foldername: "Invoice 2023", src: "/drive/invoice-2023" },
  { foldername: "Vacation Bali", src: "/drive/vacation-bali" },
  { foldername: "UI Designs", src: "/drive/ui-designs" },
  { foldername: "Podcast Episodes", src: "/drive/podcast-episodes" },
  { foldername: "Course Materials", src: "/drive/course-materials" },
  { foldername: "Client Feedback", src: "/drive/client-feedback" },
  // { foldername: "Startup Pitch", src: "/drive/startup-pitch" },
  // { foldername: "Recipe Collection", src: "/drive/recipe-collection" },
  // { foldername: "Event Planning", src: "/drive/event-planning" },
  // { foldername: "Research Notes", src: "/drive/research-notes" },
];

const FoldersSection: React.FC = () => {
  return (
    <section className="w-full h-full">
      <div className="w-full h-[40px] flex items-start justify-start">
        <p className="text-[#1C3553] text-[1.2rem] font-medium">Folders</p>
      </div>
      <div
        className={`w-full h-[calc(100%-40px)] 
      flex flex-wrap
        overflow-x-scroll`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {folders.map((folder, index) => (
          <FolderCard key={index} folder={folder} />
        ))}
      </div>
    </section>
  );
};

export default FoldersSection;
