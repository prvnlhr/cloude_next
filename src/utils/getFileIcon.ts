const fileIconMap = {
  // Documents
  doc: "mdi:file-word-box",
  docx: "mdi:file-word-box",
  pdf: "mdi:file-pdf-box",
  txt: "mdi:file-document-outline",
  rtf: "mdi:file-document-outline",
  odt: "mdi:file-document-outline",
  xls: "mdi:file-excel-box",
  xlsx: "mdi:file-excel-box",
  csv: "mdi:file-delimited",
  ppt: "mdi:file-powerpoint-box",
  pptx: "mdi:file-powerpoint-box",

  // Images
  jpg: "mdi:file-image",
  jpeg: "mdi:file-image",
  png: "mdi:file-image",
  gif: "mdi:file-image",
  bmp: "mdi:file-image",
  svg: "mdi:file-image-outline",
  webp: "mdi:file-image-outline",
  ico: "mdi:file-image-outline",
  heic: "mdi:file-image-outline",
  tiff: "mdi:file-image-outline",
  psd: "mdi:file-image-outline",
  ai: "mdi:file-image-outline",

  // Audio
  mp3: "mdi:file-music",
  wav: "mdi:file-music",
  m4a: "mdi:file-music",
  flac: "mdi:file-music",
  aac: "mdi:file-music",
  ogg: "mdi:file-music",
  wma: "mdi:file-music",
  mid: "mdi:file-music",
  midi: "mdi:file-music",

  // Video
  mp4: "mdi:file-video",
  avi: "mdi:file-video",
  mkv: "mdi:file-video",
  mov: "mdi:file-video",
  webm: "mdi:file-video",
  flv: "mdi:file-video",
  mpeg: "mdi:file-video",
  wmv: "mdi:file-video",
  m4v: "mdi:file-video",
  mpg: "mdi:file-video",

  // Archives
  zip: "mdi:folder-zip",
  rar: "mdi:folder-zip",
  tar: "mdi:folder-zip",
  gz: "mdi:folder-zip",
  "7z": "mdi:folder-zip",
  bz2: "mdi:folder-zip",
  xz: "mdi:folder-zip",

  // Code Files
  js: "mdi:file-code",
  jsx: "mdi:file-code",
  ts: "mdi:file-code",
  tsx: "mdi:file-code",
  html: "mdi:file-code",
  css: "mdi:file-code",
  scss: "mdi:file-code",
  json: "mdi:file-code",
  xml: "mdi:file-code",
  sql: "mdi:database",
  md: "mdi:markdown",
  yml: "mdi:file-code",
  yaml: "mdi:file-code",
  php: "mdi:file-code",
  py: "mdi:file-code",
  java: "mdi:file-code",
  cpp: "mdi:file-code",
  cs: "mdi:file-code",
  go: "mdi:file-code",
  rb: "mdi:file-code",
  sh: "mdi:file-code",
  pl: "mdi:file-code",
  swift: "mdi:file-code",
  kt: "mdi:file-code",

  // Executables and Scripts
  exe: "mdi:cog",
  bat: "mdi:cog",
  cmd: "mdi:cog",
  ps1: "mdi:cog",
  app: "mdi:cog",
  dll: "mdi:cog",
  so: "mdi:cog",
  jar: "mdi:cog",

  // Fonts
  ttf: "mdi:format-font",
  otf: "mdi:format-font",
  woff: "mdi:format-font",
  woff2: "mdi:format-font",
  eot: "mdi:format-font",

  // Miscellaneous
  iso: "mdi:disc",
  dmg: "mdi:disc",
  epub: "mdi:book-open",
  mobi: "mdi:book-open",
  apk: "mdi:android",
  ipa: "mdi:apple",
  deb: "mdi:ubuntu",
  rpm: "mdi:linux",
  torrent: "mdi:download",
  log: "mdi:file-document-outline",
  ini: "mdi:file-document-outline",
  conf: "mdi:file-document-outline",
  cfg: "mdi:file-document-outline",

  // Default / Unknown
  default: "mdi:file-outline",
};

// Function to get the icon for a given extension
export const getFileIcon = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  return fileIconMap[ext] || fileIconMap.default;
};
