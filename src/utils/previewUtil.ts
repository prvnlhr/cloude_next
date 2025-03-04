const previewableMimeTypes = {
  image: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
  video: ["video/mp4", "video/webm", "video/ogg"],
};

export const canPreview = (mimeType: string) => {
  return (
    previewableMimeTypes.image.includes(mimeType) ||
    previewableMimeTypes.video.includes(mimeType)
  );
};
