export const formatDate = (dateStr: string) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};
