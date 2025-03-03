import FileCard from "./FileCard";

const CategoryPage = ({ files }) => {
  return (
    <div className="w-full h-full flex flex-wrap items-start content-start justify-start gap-4">
      {files?.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
};

export default CategoryPage;
