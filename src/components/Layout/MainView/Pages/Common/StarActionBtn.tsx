import { useToast } from "@/context/ToastContext";
import useUserSession from "@/hooks/useUserSession";
import {
  addToStarred,
  removeFromStarred,
} from "@/lib/services/starred/starredService";
import { Icon } from "@iconify/react/dist/iconify.js";

const StarActionBtn = ({ action, item, itemType }) => {
  const session = useUserSession();
  const { showToast } = useToast();

  const userId = session?.userId;

  const handleStarClick = async () => {
    const starData = {
      itemId: item.id,
      itemType,
      userId,
      itemOwnerId: item.user_id,
    };

    console.log(" userId:", userId);
    console.log(" owner:", item.user_id);
    console.log(" item:", item);
    console.log(" starData:", starData);

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
      onClick={handleStarClick}
      className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium hover:bg-[#EAECEB] px-[10px] rounded"
    >
      <div className="h-full aspect-[1/2] flex items-center justify-center">
        <Icon
          icon={action.icon}
          className={`w-[75%] h-[75%]  text-[${
            item.is_starred ? "#A2A8B2" : "#1C3553"
          }]`}
        />
      </div>
      <p className="text-[0.7rem] text-[#1C3553] ml-[9px] whitespace-nowrap">
        {action.label}
      </p>
    </button>
  );
};

export default StarActionBtn;
