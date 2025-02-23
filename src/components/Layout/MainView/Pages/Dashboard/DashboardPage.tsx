import FilesSection from "./FilesSection/FilesSection";
import FoldersSection from "./FoldersSection/FoldersSection";
import { RecentUploadsSection } from "./RecentUploadsSection/RecentUploadsSection";

const DashboardPage = () => {
  return (
    <div
      className="w-full h-full pt-[20px] overflow-y-scroll"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Recent uploads section ----------------------------------------------- */}
      <div className="w-full h-[180px] mb-[20px]">
        <RecentUploadsSection />
      </div>
      {/* Folders section ----------------------------------------------- */}
      <div className="w-full h-[150px] mb-[20px]">
        <FoldersSection />
      </div>
      {/* Files section ----------------------------------------------- */}
      <div className="w-full h-[90%] mb-[20px]">
        <FilesSection />
      </div>
    </div>
  );
};

export default DashboardPage;
