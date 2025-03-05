import { getCategoryByFileExtension } from "@/utils/categoryUtils";
import CategoryCard from "./CategoryCard";
import { FileExtension } from "@/utils/categoryUtils";
interface CategoriesSectionProps {
  filesByExtensions: string[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  filesByExtensions,
}) => {
  const fileExtensionsWithDots = filesByExtensions.map((ext) => `.${ext}`);

  const categories = fileExtensionsWithDots.map((ext) =>
    getCategoryByFileExtension(ext as FileExtension)
  );

  const uniqueCategories = [...new Set(categories)];

  return (
    <section className="w-full h-full">
      <div className="w-full h-[40px] flex items-start justify-start">
        <p className="text-[#1C3553] text-[1.2rem] font-medium">Categories</p>
      </div>
      <div
        className="w-full h-[calc(100%-40px)] flex flex-wrap overflow-x-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {uniqueCategories.length > 0 ? (
          uniqueCategories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))
        ) : (
          <div className="w-full h-[200px] flex items-center justify-center">
            <p className="text-[#A2A8B2] text-[1rem] font-medium text-center">
              All your uploads will be categorized here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
