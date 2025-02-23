import { Icon } from "@iconify/react/dist/iconify.js";

type Folder = {
  foldername: string;
  src: string;
};

type FolderCardProps = {
  folder: Folder;
};

const FolderCard: React.FC<FolderCardProps> = ({ folder }) => {
  return (
    <div className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-[40%] bg-[#FAFAFA] border-[1px] border-[#E4E4E4] rounded-[6px] flex px-[10px]">
      <div className="h-full aspect-square flex items-center justify-center">
        <Icon
          icon="solar:folder-linear"
          className="w-[50%] h-[50%] text-[#1C3553]"
        />
      </div>
      <div className="flex-1 h-full flex items-center justify-start overflow-hidden">
        <p className="text-[0.7rem] text-[#1C3553] font-medium truncate">
          {folder.foldername}
        </p>
      </div>
      <div className="h-full aspect-square flex items-center justify-center">
        <Icon
          icon="qlementine-icons:menu-dots-16"
          className="w-[50%] h-[50%] text-[#1C3553]"
        />
      </div>
    </div>
  );
};

export default FolderCard;
