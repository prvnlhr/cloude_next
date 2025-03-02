// Define the type for file extensions and categories
type FileExtension = keyof typeof extensionToCategory;
type Category = (typeof extensionToCategory)[FileExtension];

// Map file extensions to logical categories
const extensionToCategory: Record<FileExtension, Category> = {
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
};

// Map categories to Iconify icons
const categoryIcons: Record<Category, string> = {
  Image: "mdi:image",
  Video: "mdi:video",
  Audio: "mingcute:music-fill",
  Document: "mdi:file-document",
  Code: "mdi:code-braces",
  Archive: "mdi:archive",
  Executable: "mdi:application",
  Font: "mdi:format-font",
  Database: "mdi:database",
  Other: "mdi:file-question",
};

// Map file extensions to specific icons (for case 2)
const fileTypeIcons: Record<FileExtension, string> = {
  ".pdf": "mdi:file-pdf",
  ".doc": "mdi:file-word",
  ".docx": "mdi:file-word",
  ".xls": "mdi:file-excel",
  ".xlsx": "mdi:file-excel",
  ".ppt": "mdi:file-powerpoint",
  ".pptx": "mdi:file-powerpoint",
  // Add more file type icons as needed
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
  fileExtension: FileExtension | null
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
export function getFileIcon(
  fileName: string,
  useCategoryIcon: boolean = false
): string {
  const fileExtension = getFileExtension(fileName);

  if (useCategoryIcon) {
    const category = getCategoryByFileExtension(fileExtension);
    return getCategoryIcon(category);
  } else {
    const normalizedFileExtension = normalizeString(fileExtension);
    console.log(
      fileName,
      fileExtension,
      fileTypeIcons[normalizedFileExtension]
    );
    return (
      fileTypeIcons[normalizedFileExtension as FileExtension] ||
      getCategoryIcon(getCategoryByFileExtension(fileExtension))
    );
  }
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
