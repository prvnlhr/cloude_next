import { getCategoryByFileExtension } from "@/utils/categoryUtils";
import CategoryCard from "./CategoryCard";

interface CategoriesSectionProps {
  filesByExtensions: string[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  filesByExtensions,
}) => {
  const fileExtensionsWithDots = filesByExtensions.map((ext) => `.${ext}`);

  const categories = fileExtensionsWithDots.map((ext) =>
    getCategoryByFileExtension(ext)
  );

  const uniqueCategories = [...new Set(categories)];

  return (
    <section className="w-full h-full">
      <div className="w-full h-[40px] flex items-start justify-start">
        <p className="text-[#1C3553] text-[1.2rem] font-medium">Categories</p>
      </div>
      <div
        className={`w-full h-[calc(100%-40px)] 
        flex flex-wrap overflow-x-scroll `}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {uniqueCategories.map((category, index) => (
          <CategoryCard key={index} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
