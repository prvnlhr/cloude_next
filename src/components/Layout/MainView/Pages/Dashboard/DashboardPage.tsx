import CategoriesSection from "./Categories/CategoriesSection";
import ActivitiesSection from "./ActivitiesSection/ActivitiesSection";
import { RecentUploadsSection } from "./RecentUploads/RecentUploadsSection";
import { DashboardContent } from "@/types/dashboardTypes";
import NoContent from "../Common/NoContent";

interface DashboardPageProps {
  dashboardContent: DashboardContent;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ dashboardContent }) => {
  const { recentUploads, filesByExtensions, recentActivities } =
    dashboardContent;
  return (
    <div
      className="w-full h-full pt-[20px] overflow-y-scroll"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {recentUploads.length === 0 ? (
        <NoContent />
      ) : (
        <>
          {/* Recent uploads section */}
          <div className="w-full h-auto mb-[20px]">
            <RecentUploadsSection recentUploads={recentUploads} />
          </div>
          {/* Categories section */}
          <div className="w-full h-auto mb-[20px]">
            <CategoriesSection filesByExtensions={filesByExtensions} />
          </div>
          {/* Activities section */}
          <div className="w-full h-auto mb-[20px]">
            <ActivitiesSection activities={recentActivities} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
