import ActivitiesTable from "./ActivitiesTable";

import { RecentActivity } from "@/types/dashboardTypes";
interface ActivitiesSectionProps {
  activities: RecentActivity[];
}

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  activities,
}) => {
  return (
    <section className="w-full h-auto">
      <div className="w-full h-[40px] flex items-start justify-start sticky top-[0px] z-[50] bg-white">
        <p className="text-[#1C3553] text-[1.2rem] font-medium">Activities</p>
      </div>
      <div className="w-full h-[calc(100%-40px)]">
        {activities.length > 0 ? (
          <ActivitiesTable activities={activities} />
        ) : (
          <div className="w-full h-[200px] flex items-center justify-center">
            <p className="text-[#A2A8B2] text-[1rem] font-medium text-center">
              Start exploring, and your activities will be displayed here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivitiesSection;
