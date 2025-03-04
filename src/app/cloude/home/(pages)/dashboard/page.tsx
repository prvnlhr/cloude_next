import DashboardPage from "@/components/Layout/MainView/Pages/Dashboard/DashboardPage";
import { fetchDashboardContent } from "@/lib/services/dashboard/dashboardServices";
import { createClient } from "@/middlewares/supabase/server";
import { DashboardContent } from "@/types/dashboardTypes";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user!.id;

  const dashboardContent: DashboardContent = await fetchDashboardContent(
    userId
  );

  return <DashboardPage dashboardContent={dashboardContent} />;
}
