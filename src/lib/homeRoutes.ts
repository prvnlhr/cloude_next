type RouteConfig = {
  path: string;
  label: string;
  icon: string;
  activeIcon: string;
  inactiveIcon: string;
};

export const Routes: RouteConfig[] = [
  {
    path: "/cloude/home/dashboard",
    label: "Dashboard",
    icon: "material-symbols:home-rounded",
    activeIcon: "fluent:home-24-filled",
    inactiveIcon: "fluent:home-24-regular",
  },
  {
    path: "/cloude/home/my-storage",
    label: "My Storage",
    icon: "material-symbols:cloud",
    activeIcon: "material-symbols:cloud",
    inactiveIcon: "material-symbols:cloud-outline",
  },
  {
    path: "/cloude/home/shared",
    label: "Shared",
    icon: "solar:share-outline",
    activeIcon: "mynaui:share-solid",
    inactiveIcon: "mynaui:share",
  },
  {
    path: "/cloude/home/starred",
    label: "Starred",
    icon: "solar:star-linear",
    activeIcon: "solar:star-bold",
    inactiveIcon: "solar:star-line-duotone",
  },
];
