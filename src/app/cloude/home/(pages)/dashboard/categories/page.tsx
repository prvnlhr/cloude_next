import CategoryPage from "@/components/Layout/MainView/Pages/Dashboard/Categories/CategoryPage";
import { fetchFilesByCategories } from "@/lib/services/categories/categoriesServices";
import { createClient } from "@/middlewares/supabase/server";
import { File } from "@/types/contentTypes";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user!.id;
  const category = params.category as string;

  const filesByCategory: File[] = await fetchFilesByCategories(
    userId,
    category
  );

  return <CategoryPage files={filesByCategory} />;
};

export default page;
