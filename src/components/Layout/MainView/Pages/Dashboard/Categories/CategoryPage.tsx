import FileCard from "./FileCard";

import { File } from "@/types/contentTypes";
interface CategoryPageProps {
  files: File[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ files }) => {
  return (
    <div className="w-full h-full flex flex-wrap items-start content-start justify-start">
      {files?.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
};

export default CategoryPage;
