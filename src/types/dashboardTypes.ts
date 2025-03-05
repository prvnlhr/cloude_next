export interface RecentUploadFile {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  extension: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
  is_starred: boolean;
  user_id: string | null;
  folder_id: string | null;
  thumbnail_url: string | null;
}

export interface RecentActivity {
  id: string;
  activity_type: "upload" | "rename" | "delete" | "move" | "star" | "share";
  item_type: "file" | "folder";
  activity_timestamp: string;
  details: {
    shared_with?: string;
    shared_with_name?: string;
    new_name?: string;
    old_name?: string;
  } | null;
  file_id: string | null;
  folder_id: string | null;
  files?: {
    id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    storage_path: string;
    thumbnail_url: string | null;
  };
  folders?: {
    id: string;
    folder_name: string;
    path: string | null;
  };
}

export interface DashboardContent {
  recentUploads: RecentUploadFile[];
  filesByExtensions: string[];
  recentActivities: RecentActivity[];
}
