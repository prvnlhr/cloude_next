import { useToast } from "@/context/ToastContext";
import useUserSession from "@/hooks/useUserSession";
import {
  addToStarred,
  removeFromStarred,
} from "@/lib/services/starred/starredService";
import { Icon } from "@iconify/react/dist/iconify.js";

const StarActionBtn = ({ action, item, itemType, isAllowed }) => {
  const session = useUserSession();
  const { showToast } = useToast();

  const userId = session?.userId;
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

    // console.log(" userId:", userId);
    // console.log(" owner:", item.user_id);
    console.log(" item:", item);
    // console.log(" item:", item.access_level);
    // console.log(" starData:", starData);
    console.log(" accessLevel:", accessLevel);

    // return;
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
      onClick={() => handleAddToStarred(action)}
      className={`w-full h-[35px] flex items-center justify-start px-[10px] rounded ${
        isAllowed
          ? "cursor-pointer hover:bg-[#EAECEB]"
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
