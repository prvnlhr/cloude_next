export interface User {
  full_name: string;
}

export interface SharedFolder {
  id: string;
  path: string | null;
  slug: string;
  user_id: string;
  created_at: string;
  is_starred: boolean;
  updated_at: string;
  folder_name: string;
  parent_folder_id: string | null;
}

export interface SharedFile {
  id: string;
  user_id: string;
  extension: string;
  file_name: string;
  file_size: number;
  file_type: string;
  folder_id: string | null;
  created_at: string;
  is_starred: boolean;
  updated_at: string;
  storage_path: string;
  thumbnail_url: string | null;
}

export interface SharedItem {
  folder_id: string | null;
  file_id: string | null;
  shared_with: string;
  users: { full_name: string }[];
  folders: SharedFolder[] | null;
  files: SharedFile[] | null;
}
