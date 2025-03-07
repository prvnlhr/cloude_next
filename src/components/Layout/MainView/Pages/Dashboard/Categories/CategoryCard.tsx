import { getCategoryIcon } from "@/utils/categoryUtils";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { Category } from "@/utils/categoryUtils";
interface CategoryCardProps {
  category: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const normalizedCategory = category && category?.toLowerCase();
  return (
    <div
      className="w-[45%] sm:w-[45%] md:w-[30%] lg:w-[18%] h-auto 
      flex flex-col items-center bg-white 
      p-[6px] my-[15px]
      mx-[2.5%] sm:mx-[2.5%] md:mx-[1.5%] lg:mx-[1%]
      rounded-[10px]
      shadow-[0px_3px_5px_rgba(0,0,0,0.04)]
      hover:shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]
      relative
      "
    >
      <div className="w-full h-[40px] flex items-start justify-start rounded-[10px]">
        <div
          className="h-full aspect-square bg-[#F7F7F7] flex items-center justify-center"
          style={{
            borderRadius: "inherit",
          }}
        >
          <Icon
            icon={getCategoryIcon(category as Category)}
            className="w-[60%] h-[60%] text-[#87ADF4]"
          />
        </div>
        <div className="h-full flex-grow min-w-0 flex flex-col justify-center">
          <p className="text-[#1C3553] w-[90%] ml-[10px] text-[0.8rem] font-medium truncate whitespace-nowrap">
            {category}
          </p>
        </div>
        <div className="h-full aspect-[1/1] flex-shrink-0 flex items-center justify-center relative">
          <Link
            href={`dashboard/categories?category=${normalizedCategory}`}
            type="button"
            className="w-[85%] aspect-square flex items-center  justify-center bg-[#F7F7F7] rounded-full"
          >
            <Icon
              icon="lucide:arrow-up"
              className="w-[55%] h-[55%] text-[#87ADF4] rotate-45"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
