import { Icon } from "@iconify/react/dist/iconify.js";
import useUserSession from "@/hooks/useUserSession";
import StarActionBtn from "./StarActionBtn"; // Import the StarActionBtn component

const ActionMenu = ({ dropdownRef, item, itemType, setActiveModal }) => {
  const session = useUserSession();
  const userId = session?.userId;

  const allActions = [
    {
      label: "Rename",
      icon: "mingcute:edit-line",
      value: "rename",
    },
    {
      label: "Share",
      icon: "mynaui:share",
      value: "share",
    },
    {
      label: "Delete",
      icon: "solar:trash-bin-2-linear",
      value: "delete",
    },
    {
      label: item.is_starred ? "Remove from Starred" : "Add to Starred",
      icon: item.is_starred ? "solar:star-bold" : "solar:star-line-duotone",
      value: "star",
    },
  ];

  const accessLevel = item.access_level || "READ";

  // Check if the   user is the owner of the item
  const isOwner = userId === item.user_id;

  const accessLevelMap = {
    FULL: new Set(["rename", "share", "delete", "star"]),
    WRITE: new Set(["rename", "star"]),
    READ: new Set(["star"]),
  };

  const isActionAllowed = (actionValue) => {
    // Owners have full access to all actions
    if (isOwner) return true;

    return accessLevelMap[accessLevel].has(actionValue);
  };

  // Handle action click
  const handleActionClick = (action) => {
    if (isActionAllowed(action.value)) {
      setActiveModal({ value: action.value, item, type: itemType });
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="z-[50] w-auto h-auto flex flex-col absolute top-0 right-[5px] bg-white shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] p-[5px] rounded border"
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        {allActions.map((action, index) => {
          const isAllowed = isActionAllowed(action.value);

          // If the action is "star", show StarActionBtn component
          if (action.value === "star") {
            return (
              <StarActionBtn
                key={index}
                action={action}
                item={item}
                itemType={itemType}
                isAllowed={isAllowed}
              />
            );
          }

          // For other actions, show the default button
          return (
            <button
              type="button"
              onClick={() => handleActionClick(action)}
              key={index}
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
        })}
      </div>
    </div>
  );
};

export default ActionMenu;
