type Route = {
  label: string;
  path: string;
  icon?: any;
  exact?: boolean;
  hidden?: boolean;
};
export const routes: Route[] = [
  {
    label: "Dashboard",
    path: "/cloude/dashboard",
    icon: "mynaui:home",
  },
  {
    label: "My Storage",
    path: "/cloude/my-storage",
    icon: "stash:cloud-duotone",
  },

  {
    label: "Shared",
    path: "/cloude/shared",
    icon: "solar:share-outline",
  },
  {
    label: "Starred",
    path: "/cloude/starred",
    icon: "solar:star-linear",
  },
];
