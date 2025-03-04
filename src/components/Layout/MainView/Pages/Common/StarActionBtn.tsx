import { useToast } from "@/context/ToastContext";
import useUserSession from "@/hooks/useUserSession";
import {
  addToStarred,
  removeFromStarred,
} from "@/lib/services/starred/starredService";
import { Icon } from "@iconify/react/dist/iconify.js";
import { File, Folder } from "@/types/contentTypes";

type Action = {
  label: string;
  icon: string;
  value: string;
};

interface StarActionBtnProps {
  action: Action;
  item: File | Folder;
  itemType: string;
  isAllowed: boolean;
}

const StarActionBtn: React.FC<StarActionBtnProps> = ({
  action,
  item,
  itemType,
  isAllowed,
}) => {
  const session = useUserSession();
  const { showToast } = useToast();

  const userId = session?.userId as string;
  const accessLevel =
    userId === item.user_id ? "FULL" : item.access_level || "READ";

  const handleAddToStarred = async () => {
    const starData = {
      itemId: item.id,
      itemType,
      userId,
      itemOwnerId: item.user_id,
      accessLevel,
    };
    const starResponse = item.is_starred
      ? await removeFromStarred(starData, showToast)
      : await addToStarred(starData, showToast);
    console.log(" starResponse:", starResponse);
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      type="button"
      onClick={() => handleAddToStarred()}
      className={`w-full h-[35px] flex items-center justify-start px-[10px] rounded ${
        isAllowed
          ? "cursor-pointer hover:bg-[#F6F6F6]"
          : "cursor-not-allowed opacity-50"
      }`}
      disabled={!isAllowed}
    >
      <div className="h-full aspect-[1/2] flex items-center justify-center">
        <Icon
          icon={action.icon}
          className={`w-[75%] h-[75%] ${
            isAllowed ? "text-[#1C3553]" : "text-[#A2A8B2]"
          }`}
        />
      </div>
      <p
        className={`text-[0.75rem] font-medium ml-[9px] whitespace-nowrap ${
          isAllowed ? "text-[#1C3553]" : "text-[#A2A8B2]"
        }`}
      >
        {action.label}
      </p>
    </button>
  );
};

export default StarActionBtn;
