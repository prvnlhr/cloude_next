import CategoriesSection from "./Categories/CategoriesSection";
import FilesSection from "./FilesSection/FilesSection";
import { RecentUploadsSection } from "./RecentUploads/RecentUploadsSection";
const DashboardPage = ({ dashboardContent }) => {
  const { recentUploads, filesByExtensions, sharedFiles } = dashboardContent;
  return (
    <div
      className="w-full h-full pt-[20px] overflow-y-scroll"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Recent uploads section ----------------------------------------------- */}
      <div className="w-full h-[220px] mb-[20px]">
        <RecentUploadsSection recentUploads={recentUploads} />
      </div>
      {/* Categories section ----------------------------------------------- */}
      <div className="w-full h-auto mb-[20px]">
        <CategoriesSection filesByExtensions={filesByExtensions} />
      </div>
      {/* Files section ----------------------------------------------- */}
      <div className="w-full h-[90%] mb-[20px]">
        <FilesSection />
      </div>
    </div>
  );
};

export default DashboardPage;
