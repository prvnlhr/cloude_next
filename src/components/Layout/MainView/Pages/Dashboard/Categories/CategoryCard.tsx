import { getCategoryIcon } from "@/utils/categoryUtils";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

const CategoryCard: React.FC = ({ category }) => {
  const normalizedCategory = category && category?.toLowerCase();
  return (
    <div className="h-[45px] sm:w-[18%] mx-[1%] my-[10px] w-[48%] bg-[#FAFAFA] border-[1px] border-[#E4E4E4] rounded-[6px] flex items-center">
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
        className="h-[70%] aspect-square flex items-center justify-center bg-[#E4E7EC] rounded-full mx-[10px]"
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
