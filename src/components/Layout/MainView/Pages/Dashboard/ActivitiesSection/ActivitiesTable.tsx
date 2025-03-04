import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { RecentActivity } from "@/types/dashboardTypes";

interface ActivitiesTableProps {
  activities: RecentActivity[];
}

const ActivitiesTable: React.FC<ActivitiesTableProps> = ({ activities }) => {
  const columns = ["Name", "Type", "Activity", "Date"];

  // Capitalizes first letter of a string
  const capitalize = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);

  // Formats ISO date string to "22 June 2024" format
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getLinkUrl = (itemType: string, itemId: string): string => {
    return `/cloude/home/my-storage/${
      itemType === "folder" ? "folders" : "files"
    }/${itemId}`;
  };

  return (
    <div
      className="w-full h-full overflow-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <table className="min-w-full border-collapse">
        {/* Table Head */}
        <thead className="bg-[#F6F6F6] sticky top-0 z-10">
          <tr className="text-left text-[#1C3553] text-[0.8rem]">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 capitalize whitespace-nowrap border-x border-[#D0D5DD]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {activities.map((activity, index) => {
            const {
              item_type,
              activity_type,
              activity_timestamp,
              // item_name,
              file_id,
              folder_id,
            } = activity;
            const itemId = (
              item_type === "folder" ? folder_id : file_id
            ) as string;

            return (
              <tr
                key={index}
                className="border border-[#D0D5DD] hover:bg-[#F6F6F6] text-[0.8rem]"
              >
                {/* Name with Icon */}
                <td className="px-4 py-2 h-[50px] border border-[#D0D5DD] whitespace-nowrap text-[#1C3553]">
                  <Link
                    href={getLinkUrl(item_type, itemId)}
                    // aria-label={`Open ${item_name}`}
                  >
                    <div className="flex items-center">
                      <div className="h-[30px] rounded aspect-square bg-[#F2F4F5]  border border-[#D0D5DD] flex items-center justify-center">
                        <Icon
                          className="w-[60%] h-[60%]"
                          icon={
                            item_type === "folder"
                              ? "solar:folder-bold"
                              : "tabler:file-filled"
                          }
                        />
                      </div>
                      <p className="ml-4 font-medium">
                        {/* {capitalize(item_name)} */}
                      </p>
                    </div>
                  </Link>
                </td>

                {/* Type */}
                <td className="px-4 py-2 border border-[#D0D5DD] whitespace-nowrap text-[#1C3553] font-medium ">
                  {capitalize(item_type)}
                </td>

                {/* Activity */}
                <td className="px-4 py-2 border border-[#D0D5DD] whitespace-nowrap text-[#1C3553] ">
                  {activity_type === "share" ? (
                    <>
                      <p className="text-[#1C3553] font-medium">{`You Shared ${item_type}`}</p>
                      <p className="text-[#758DA7] ">
                        With :
                        <span className="underline ml-[5px] text-[#1C3553]">
                          {/* {activity.shared_with_name} */}
                        </span>
                      </p>
                    </>
                  ) : activity_type === "rename" ? (
                    <>
                      {/* <p className="text-[#1C3553] font-medium">{`Renamed ${item_type} ${activity.details.old_name}`}</p> */}
                      <p className="text-[#758DA7]">
                        To :
                        <span className="ml-[5px] underline text-[#1C3553]">
                          {/* {activity.details.new_name} */}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="text-[#1C3553] font-medium">
                      {capitalize(activity_type)}
                    </p>
                  )}
                </td>

                {/* Date */}
                <td className="px-4 py-2 border border-[#D0D5DD] whitespace-nowrap text-[#1C3553] font-medium">
                  {formatDate(activity_timestamp)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActivitiesTable;
