import CategoryPage from "@/components/Layout/MainView/Pages/Dashboard/Categories/CategoryPage";
import { fetchFilesByCategories } from "@/lib/services/categories/categoriesServices";
import { createClient } from "@/middlewares/supabase/server";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

type PageProps = {
  searchParams: SearchParams;
};

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user!.id;
  const category = params.category;

  const filesByCategory = await fetchFilesByCategories(userId, category);

  return <CategoryPage files={filesByCategory} />;
};

export default page;
