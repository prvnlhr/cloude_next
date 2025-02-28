export const getFileExtension = (file) => {
  const pathParts = file?.storage_path?.split(".");
  return pathParts[pathParts?.length - 1];
};
