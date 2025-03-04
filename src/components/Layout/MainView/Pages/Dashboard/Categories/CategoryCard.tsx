import { getCategoryIcon } from "@/utils/categoryUtils";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

interface CategoryCardProps {
  category: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const normalizedCategory = category && category?.toLowerCase();
  return (
    <div
      className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] h-auto 
      mx-[1%] my-[15px] 
      bg-[#F6F6F6] border-[1px] border-[#E4E7EC] 
      flex
      items-center
      justify-between  
      rounded-[10px]
      min-h-[45px]
      relative
      z-[4]
      cursor-pointer
      overflow-hidden
      shadow-[0px_3px_5px_rgba(0,0,0,0.04)]"
    >
      <div className="h-full aspect-square flex items-center justify-center">
        <Icon
          icon={getCategoryIcon(category)}
          className="w-[50%] h-[50%] text-[#1C3553]"
        />
      </div>
      <div className="flex-1 h-full flex items-center justify-start overflow-hidden">
        <p className="text-[0.7rem] text-[#1C3553] font-medium truncate">
          {category}
        </p>
      </div>
      <Link
        href={`dashboard/categories?category=${normalizedCategory}`}
        className="h-[80%] aspect-square flex items-center justify-center bg-white border border-[#E4E7EC] rounded-full mr-[5px] ml-[10px]"
      >
        <Icon
          icon="meteor-icons:arrow-up"
          className="w-[50%] h-[50%] text-[#1C3553] rotate-45"
        />
      </Link>
    </div>
  );
};

export default CategoryCard;
