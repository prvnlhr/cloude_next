export interface File {
  id: string;
  user_id: string;
  folder_id: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  thumbnail_url: string | null;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
  extension: string;
}

export interface Folder {
  id: string;
  user_id: string;
  parent_folder_id: string | null;
  folder_name: string;
  slug: string;
  path: string | null;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormattedFile {
  item_id: string;
  name: string;
  type: "file";
  is_shared: boolean;
  extension: string;
}

export interface FormattedFolder {
  item_id: string;
  name: string;
  type: "folder";
  is_shared: boolean;
  extension: "folder";
}

export interface FormattedSharedItem {
  item_id: string;
  item_type: "file" | "folder";
  is_shared: true;
  name: string;
  extension: string;
  type: "file" | "folder";
}

export interface SearchResult {
  files: FormattedFile[];
  folders: FormattedFolder[];
  shared_items: FormattedSharedItem[];
}
