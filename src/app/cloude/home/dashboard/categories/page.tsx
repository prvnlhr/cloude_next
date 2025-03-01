import CategoryPage from "@/components/Layout/MainView/Pages/Dashboard/Categories/CategoryPage";
import { fetchFilesByCategories } from "@/lib/services/categories/categoriesServices";
import { createClient } from "@/middlewares/supabase/server";
import { getFileExtensionsByCategory } from "@/utils/categoryUtils";
// import { getFileTypesByCategory } from "@/utils/categoryUtils";

const page = async ({ searchParams }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user!.id;
  const { category } = (await searchParams) || "";

  const filesByCategory = await fetchFilesByCategories(userId, category);
  console.log(" filesByCategory:", filesByCategory);

  return <CategoryPage files={filesByCategory} />;
};

export default page;
