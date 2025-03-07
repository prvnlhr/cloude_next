const extensionToCategory = {
  // Image Extensions
  ".jpeg": "Image",
  ".jpg": "Image",
  ".png": "Image",
  ".gif": "Image",
  ".webp": "Image",
  ".svg": "Image",
  ".bmp": "Image",
  ".tiff": "Image",
  ".ico": "Image",
  ".heif": "Image",
  ".heic": "Image",
  ".avif": "Image",

  // Video Extensions
  ".mp4": "Video",
  ".mkv": "Video",
  ".mov": "Video",
  ".avi": "Video",
  ".wmv": "Video",
  ".flv": "Video",
  ".webm": "Video",
  ".3gp": "Video",
  ".3g2": "Video",
  ".mpeg": "Video",
  ".ogg": "Video",
  ".m4v": "Video",

  // Audio Extensions
  ".mp3": "Audio",
  ".wav": "Audio",
  ".aac": "Audio",
  ".weba": "Audio",
  ".aiff": "Audio",
  ".m4a": "Audio",
  ".wma": "Audio",
  ".flac": "Audio",
  ".midi": "Audio",
  ".mid": "Audio",

  // Document Extensions
  ".pdf": "Document",
  ".doc": "Document",
  ".docx": "Document",
  ".xls": "Document",
  ".xlsx": "Document",
  ".ppt": "Document",
  ".pptx": "Document",
  ".txt": "Document",
  ".csv": "Document",
  ".rtf": "Document",
  ".odt": "Document",
  ".ods": "Document",
  ".odp": "Document",
  ".epub": "Document",
  ".mobi": "Document",

  // Code Extensions
  ".js": "Code",
  ".html": "Code",
  ".css": "Code",
  ".json": "Code",
  ".xml": "Code",
  ".py": "Code",
  ".java": "Code",
  ".c": "Code",
  ".cpp": "Code",
  ".php": "Code",
  ".rb": "Code",
  ".pl": "Code",
  ".go": "Code",
  ".swift": "Code",
  ".ts": "Code",
  ".rs": "Code",
  ".kt": "Code",
  ".scala": "Code",
  ".lua": "Code",
  ".md": "Code",
  ".yaml": "Code",
  ".toml": "Code",
  ".ini": "Code",
  ".dart": "Code",
  ".clj": "Code",
  ".hs": "Code",
  ".ex": "Code",
  ".erl": "Code",
  ".ml": "Code",
  ".fs": "Code",
  ".r": "Code",
  ".m": "Code",
  ".sql": "Code",
  ".pls": "Code",
  ".ps1": "Code",
  ".bat": "Code",
  ".vbs": "Code",
  ".coffee": "Code",
  ".less": "Code",
  ".sass": "Code",
  ".styl": "Code",
  ".jade": "Code",
  ".hbs": "Code",
  ".ejs": "Code",
  ".twig": "Code",
  ".liquid": "Code",
  ".conf": "Code",
  ".dockerfile": "Code",
  ".gitignore": "Code",
  ".eslintrc": "Code",
  ".prettierrc": "Code",
  ".babelrc": "Code",

  // Archive/Compressed Extensions
  ".zip": "Archive",
  ".tar": "Archive",
  ".gz": "Archive",
  ".bz2": "Archive",
  ".7z": "Archive",
  ".rar": "Archive",
  ".xz": "Archive",
  ".lz": "Archive",
  ".lzma": "Archive",
  ".lzo": "Archive",
  ".sz": "Archive",

  // Executable Extensions
  ".exe": "Executable",
  ".sh": "Executable",
  ".bin": "Executable",
  ".dmg": "Executable",
  ".pkg": "Executable",
  ".deb": "Executable",
  ".rpm": "Executable",
  ".msi": "Executable",
  ".dll": "Executable",

  // Font Extensions
  ".ttf": "Font",
  ".otf": "Font",
  ".woff": "Font",
  ".woff2": "Font",
  ".eot": "Font",
  ".sfnt": "Font",

  // Database Extensions
  ".sqlite": "Database",
  ".db": "Database",
  ".mdb": "Database",
  ".accdb": "Database",
  ".dbf": "Database",
  ".nc": "Database",

  // Other Extensions
  ".dat": "Other",
  ".log": "Other",
  ".tmp": "Other",
} as const;

export type FileExtension = keyof typeof extensionToCategory;
export type Category = (typeof extensionToCategory)[FileExtension];

const categoryIcons: Record<Category, string> = {
  Image: "material-symbols:image-rounded",
  Video: "majesticons:video",
  Audio: "eva:music-fill",
  Document: "basil:file-solid",
  Code: "mingcute:code-line",
  Archive: "material-symbols-light:archive",
  Executable: "eos-icons:application",
  Font: "fluent:text-font-24-filled",
  Database: "solar:database-bold",
  Other: "ant-design:file-unknown-filled",
};

// Map file extensions to specific icons (for case 2)
export const fileTypeIcons: Record<FileExtension, string> = {
  // Image Extensions
  ".jpeg": "mdi:image",
  ".jpg": "mdi:image",
  ".png": "mdi:image",
  ".gif": "mdi:image",
  ".webp": "mdi:image",
  ".svg": "mdi:image",
  ".bmp": "mdi:image",
  ".tiff": "mdi:image",
  ".ico": "mdi:image",
  ".heif": "mdi:image",
  ".heic": "mdi:image",
  ".avif": "mdi:image",

  // Video Extensions
  ".mp4": "mdi:video",
  ".mkv": "mdi:video",
  ".mov": "mdi:video",
  ".avi": "mdi:video",
  ".wmv": "mdi:video",
  ".flv": "mdi:video",
  ".webm": "mdi:video",
  ".3gp": "mdi:video",
  ".3g2": "mdi:video",
  ".mpeg": "mdi:video",
  ".ogg": "mdi:video",
  ".m4v": "mdi:video",

  // Audio Extensions
  ".mp3": "eva:music-fill",
  ".wav": "eva:music-fill",
  ".aac": "eva:music-fill",
  ".weba": "eva:music-fill",
  ".aiff": "eva:music-fill",
  ".m4a": "eva:music-fill",
  ".wma": "eva:music-fill",
  ".flac": "eva:music-fill",
  ".midi": "eva:music-fill",
  ".mid": "eva:music-fill",

  // Document Extensions
  ".pdf": "ri:file-pdf-2-fill",
  ".doc": "mingcute:doc-fill",
  ".docx": "mingcute:doc-fill",
  ".xls": "ri:file-excel-2-fill",
  ".xlsx": "ri:file-excel-2-fill",
  ".ppt": "teenyicons:ms-powerpoint-solid",
  ".pptx": "teenyicons:ms-powerpoint-solid",
  ".txt": "mdi:file-document",
  ".csv": "mdi:file-document",
  ".rtf": "mdi:file-document",
  ".odt": "mdi:file-document",
  ".ods": "mdi:file-document",
  ".odp": "mdi:file-document",
  ".epub": "mdi:book-open",
  ".mobi": "mdi:book-open",

  // Code Extensions
  ".js": "fa6-brands:square-js",
  ".html": "fa6-brands:html5",
  ".css": "fa6-brands:css",
  ".json": "si:json-fill",
  ".xml": "mdi:code-braces",
  ".py": "mdi:language-python",
  ".java": "mdi:language-java",
  ".c": "mdi:language-c",
  ".cpp": "devicon-plain:cplusplus",
  ".php": "mdi:language-php",
  ".rb": "mdi:language-ruby",
  ".pl": "mdi:language-perl",
  ".go": "mdi:language-go",
  ".swift": "mdi:language-swift",
  ".ts": "mdi:language-typescript",
  ".rs": "mdi:language-rust",
  ".kt": "mdi:language-kotlin",
  ".scala": "mdi:language-scala",
  ".lua": "mdi:language-lua",
  ".md": "mdi:language-markdown",
  ".yaml": "mdi:code-braces",
  ".toml": "mdi:code-braces",
  ".ini": "mdi:code-braces",
  ".dart": "mdi:language-dart",
  ".clj": "mdi:language-clojure",
  ".hs": "mdi:language-haskell",
  ".ex": "mdi:language-elixir",
  ".erl": "mdi:language-erlang",
  ".ml": "mdi:language-ocaml",
  ".fs": "mdi:language-fsharp",
  ".r": "mdi:language-r",
  ".m": "mdi:language-matlab",
  ".sql": "mdi:database",
  ".pls": "mdi:code-braces",
  ".ps1": "mdi:code-braces",
  ".bat": "mdi:code-braces",
  ".vbs": "mdi:code-braces",
  ".coffee": "mdi:language-coffeescript",
  ".less": "mdi:language-css3",
  ".sass": "mdi:language-css3",
  ".styl": "mdi:language-css3",
  ".jade": "mdi:language-html5",
  ".hbs": "mdi:language-html5",
  ".ejs": "mdi:language-html5",
  ".twig": "mdi:language-html5",
  ".liquid": "mdi:language-html5",
  ".conf": "mdi:code-braces",
  ".dockerfile": "mdi:docker",
  ".gitignore": "mdi:git",
  ".eslintrc": "mdi:code-braces",
  ".prettierrc": "mdi:code-braces",
  ".babelrc": "mdi:code-braces",

  // Archive/Compressed Extensions
  ".zip": "mdi:zip-box",
  ".tar": "mdi:archive",
  ".gz": "mdi:archive",
  ".bz2": "mdi:archive",
  ".7z": "mdi:archive",
  ".rar": "mdi:archive",
  ".xz": "mdi:archive",
  ".lz": "mdi:archive",
  ".lzma": "mdi:archive",
  ".lzo": "mdi:archive",
  ".sz": "mdi:archive",

  // Executable Extensions
  ".exe": "eos-icons:application",
  ".sh": "mdi:bash",
  ".bin": "mdi:application",
  ".dmg": "mdi:apple",
  ".pkg": "mdi:package",
  ".deb": "mdi:ubuntu",
  ".rpm": "mdi:linux",
  ".msi": "mdi:microsoft-windows",
  ".dll": "mdi:application",

  // Font Extensions
  ".ttf": "flowbite:font-family-outline",
  ".otf": "flowbite:font-family-outline",
  ".woff": "flowbite:font-family-outline",
  ".woff2": "flowbite:font-family-outline",
  ".eot": "flowbite:font-family-outline",
  ".sfnt": "flowbite:font-family-outline",

  // Database Extensions
  ".sqlite": "mdi:database",
  ".db": "mdi:database",
  ".mdb": "mdi:database",
  ".accdb": "mdi:database",
  ".dbf": "mdi:database",
  ".nc": "mdi:database",

  // Other Extensions
  ".dat": "mdi:file-question",
  ".log": "mdi:file-document",
  ".tmp": "mdi:file-question",
};

// project.pdf -> .pdf
export function getFileExtension(fileName: string): FileExtension {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
    return "" as FileExtension;
  }

  return fileName.slice(lastDotIndex).toLowerCase() as FileExtension;
}

function normalizeString(input: string): string {
  return input.trim().toLowerCase();
}

// .js -> 'Code'
export function getCategoryByFileExtension(
  fileExtension: FileExtension
): Category {
  if (extensionToCategory[fileExtension]) {
  }
  return fileExtension ? extensionToCategory[fileExtension] : "Other";
}

// 'Code' -> code icon
export function getCategoryIcon(category: Category): string {
  return categoryIcons[category] || categoryIcons.Other;
}

// project.pdf -> 'pdf icon'
export function getFileIcon(fileName: string): string {
  const fileExtension = getFileExtension(fileName);

  const normalizedFileExtension = normalizeString(fileExtension);
  return (
    fileTypeIcons[normalizedFileExtension as FileExtension] ||
    getCategoryIcon(getCategoryByFileExtension(fileExtension))
  );
}

// algorithm.js -> 'Code'
export function getCategoryByFileName(fileName: string): Category {
  const fileExtension = getFileExtension(fileName);
  return getCategoryByFileExtension(fileExtension);
}

// .js -> 'Code'
export function getFileExtensionsByCategory(
  category: Category
): FileExtension[] {
  const normalizedCategory = normalizeString(category);
  return Object.keys(extensionToCategory).filter(
    (fileExtension) =>
      normalizeString(extensionToCategory[fileExtension as FileExtension]) ===
      normalizedCategory
  ) as FileExtension[];
}

export function getUnmappedFileExtensions(): FileExtension[] {
  return Object.keys(extensionToCategory).filter(
    (fileExtension) =>
      extensionToCategory[fileExtension as FileExtension] === "Other"
  ) as FileExtension[];
}

export function getPreviewInfo(fileName: string): {
  canPreview: boolean;
  type: "image" | "video" | null;
} {
  const fileExtension = getFileExtension(fileName);
  const category = getCategoryByFileExtension(fileExtension);

  const canPreview = category === "Image" || category === "Video";

  const type =
    category === "Image" ? "image" : category === "Video" ? "video" : null;

  return { canPreview, type };
}
