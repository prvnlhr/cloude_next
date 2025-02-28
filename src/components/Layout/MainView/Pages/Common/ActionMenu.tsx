import { Icon } from "@iconify/react/dist/iconify.js";

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
      label: "Add to Starred",
      icon: "solar:star-line-duotone",
      value: "star",
    },
  ];

  return (
    <div
      ref={dropdownRef}
      className={`w-auto h-[auto] flex flex-col absolute top-[0px] right-[5px] bg-white shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] p-[5px] rounded border`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        {actions.map((action, index) => (
          <button
            type="button"
            onClick={() =>
              setActiveModal({ value: action.value, item, type: itemType })
            }
            key={index}
            className="w-full h-[35px] flex items-center justify-start cursor-pointer text-[#1C3553] text-[0.9rem] font-medium  hover:bg-[#EAECEB] px-[10px] rounded"
          >
            <div className="h-full aspect-[1/2] flex items-center justify-center">
              <Icon icon={action.icon} className="w-[75%] h-[75%]" />
            </div>
            <p className="text-[0.7rem] text-[#1C3553] ml-[9px]">
              {action.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionMenu;
