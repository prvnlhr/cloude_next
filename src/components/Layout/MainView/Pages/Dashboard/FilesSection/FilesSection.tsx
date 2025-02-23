import FilesTable from "./FilesTable";

const FilesSection = () => {
  return (
    <section className="w-full h-full">
      <div className="w-full h-[40px] flex items-start justify-start">
        <p className="text-[#1C3553] text-[1.2rem] font-medium">Files</p>
      </div>
      <div className="w-full h-[calc(100%-40px)]">
        <FilesTable />
      </div>
    </section>
  );
};

export default FilesSection;
