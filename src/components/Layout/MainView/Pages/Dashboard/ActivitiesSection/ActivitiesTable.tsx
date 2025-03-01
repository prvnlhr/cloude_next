import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

const ActivitiesTable = ({ activities }) => {
  const columns = ["Name", "Type", "Activity", "Date"];

  // Capitalizes first letter of a string
  const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

  // Formats ISO date string to "22 June 2024" format
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Generates URL for navigation based on item type & activity
  const getLinkUrl = (itemType, itemId, activityType) => {
    const pageMap = {
      share: "sharred",
      upload: "my-storage",
      rename: "my-storage",
    };

    return `/cloude/home/${pageMap[activityType]}/${itemType === "folder" ? "folders" : "files"}/${itemId}`;
  };

  return (
    <div className="w-full h-full overflow-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
      <table className="min-w-full border-collapse">
        {/* Table Head */}
        <thead className="bg-[#EEEEEE] sticky top-0 z-10">
          <tr className="text-left text-[#1C3553] text-[0.8rem]">
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 capitalize whitespace-nowrap border-x border-[#E4E4E4]">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {activities.map((activity, index) => {
            const { item_type, activity_type, timestamp, item_name, file_id, folder_id } = activity;
            const itemId = item_type === "folder" ? folder_id : file_id;

            return (
              <tr key={index} className="border border-[#E4E4E4] hover:bg-gray-100">
                {/* Name with Icon */}
                <td className="px-4 py-2 border border-[#E4E4E4] whitespace-nowrap text-[#1C3553] text-[0.8rem]">
                  <Link href={getLinkUrl(item_type, itemId, activity_type)} aria-label={`Open ${item_name}`}>
                    <div className="flex items-center">
                      <Icon icon={item_type === "folder" ? "solar:folder-bold" : "tabler:file-filled"} />
                      <p className="ml-2">{capitalize(item_name)}</p>
                    </div>
                  </Link>
                </td>

                {/* Type */}
                <td className="px-4 py-2 border border-[#E4E4E4] whitespace-nowrap text-[#1C3553] text-[0.8rem]">
                  {capitalize(item_type)}
                </td>

                {/* Activity */}
                <td className="px-4 py-2 border border-[#E4E4E4] whitespace-nowrap text-[#1C3553] text-[0.8rem]">
                  {capitalize(activity_type)}
                </td>

                {/* Date */}
                <td className="px-4 py-2 border border-[#E4E4E4] whitespace-nowrap text-[#1C3553] text-[0.8rem]">
                  {formatDate(timestamp)}
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
