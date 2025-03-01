import { Icon } from "@iconify/react/dist/iconify.js";
import StarActionBtn from "./StarActionBtn";
import { usePathname } from "next/navigation";

const ActionMenu = ({ dropdownRef, item, itemType, setActiveModal }) => {
  const actions = [
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

  const handleActionClick = (action) => {
    if (action.value !== "star") {
      setActiveModal({ value: action.value, item, type: itemType });
    }
  };

  const pathname = usePathname();

  const getBasePath = () => {
    const match = pathname.match(
      /\/cloude\/home\/(my-storage|shared|starred|dashboard)/
    );
    return match ? match[0] : "";
  };

  const basePath = getBasePath();
  const isSharedPage = basePath.split("/").includes("shared");

  return (
    <div
      ref={dropdownRef}
      className="w-auto h-auto flex flex-col absolute top-0 right-[5px] bg-white shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] p-[5px] rounded border"
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        {actions.map((action, index) =>
          action.value === "star" ? (
            <StarActionBtn
              key={index}
              action={action}
              item={item}
              itemType={itemType}
            />
          ) : (
            <button
              type="button"
              onClick={() => handleActionClick(action)}
              key={index}
              className={`w-full h-[35px] flex items-center justify-start cursor-pointer px-[10px] rounded ${
                isSharedPage
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-[#EAECEB]"
              }`}
              disabled={isSharedPage}
            >
              <div className="h-full aspect-[1/2] flex items-center justify-center">
                <Icon
                  icon={action.icon}
                  className={`w-[75%] h-[75%] ${
                    isSharedPage ? "text-[#A2A8B2]" : "text-[#1C3553]"
                  }`}
                />
              </div>
              <p
                className={`text-[0.75rem] font-medium ml-[9px] whitespace-nowrap ${
                  isSharedPage ? "text-[#A2A8B2]" : "text-[#1C3553]"
                }`}
              >
                {action.label}
              </p>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ActionMenu;
