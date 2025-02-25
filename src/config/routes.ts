type RouteConfig = {
  path: string;
  label: string;
  icon: string;
};

export const Routes: RouteConfig[] = [
  {
    path: "/cloude/home/dashboard",
    label: "Dashboard",
    icon: "mynaui:home",
  },
  {
    path: "/cloude/home/my-storage",
    label: "My Storage",
    icon: "stash:cloud-duotone",
  },
  {
    path: "/cloude/home/shared",
    label: "Shared",
    icon: "solar:share-outline",
  },
  {
    path: "/cloude/home/starred",
    label: "Starred",
    icon: "solar:star-linear",
  },
];
