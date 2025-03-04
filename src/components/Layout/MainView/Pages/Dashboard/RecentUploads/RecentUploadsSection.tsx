import RecentUploadFileCard from "./RecentUploadFileCard";
import { RecentUploadFile } from "@/types/dashboardTypes";

interface RecentUploadsSectionProps {
  recentUploads: RecentUploadFile[];
}
export const RecentUploadsSection: React.FC<RecentUploadsSectionProps> = ({
  recentUploads,
}) => {
  return (
    <section className="w-full h-full">
      <div className="w-full h-[40px]  flex items-start justify-start">
        <p className="text-[#1C3553] text-[1.2rem] font-medium">
          Recent Uploads
        </p>
      </div>
      <div
        className="w-full h-[calc(100%-40px)] flex items-center justify-start overflow-x-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* card -------------- */}
        {recentUploads.map((item, index) => (
          <RecentUploadFileCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
};
