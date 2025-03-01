import FilesTable from "./ActivitiesTable";

const ActivitiesSection = ({ activities }) => {
  return (
    <section className="w-full h-auto">
      <div className="w-full h-[40px] flex items-start justify-start">
        <p className="text-[#1C3553] text-[1.2rem] font-medium">Activities</p>
      </div>
      <div className="w-full h-[calc(100%-40px)]">
        <FilesTable activities={activities} />
      </div>
    </section>
  );
};

export default ActivitiesSection;
