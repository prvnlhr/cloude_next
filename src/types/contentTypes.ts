export type File = {
  id: string;
  user_id: string;
  folder_id?: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  extension?: string | null;
  thumbnail_url?: string | null;
  created_at: string;
  updated_at: string;
  is_starred: boolean;
  access_level?: string;
};

export type Folder = {
  id: string;
  user_id: string;
  folder_name: string;
  thumbnail_url?: string | null;
  parent_folder_id?: string | null;
  is_starred: boolean;
  slug: string;
  path: string;
  created_at: string;
  updated_at: string;
  access_level?: string;
};

export interface ContentPageContent {
  files: File[];
  folders: Folder[];
}
