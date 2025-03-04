export type FileMetadata = {
  id?: string;
  user_id: string;
  folder_id?: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  extension?: string | null;
  created_at?: Date;
  updated_at?: Date;
};

export type FileUploadRequest = {
  file: File;
  userId: string;
  folderId?: string | null;
};

export type Activity = {
  activity_type: string;
  item_type: string;
  file_id?: string | null;
  folder_id?: string | null;
  user_id: string;
  details?: Record<string, string> | null;
};
