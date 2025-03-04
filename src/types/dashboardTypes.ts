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
  activity_type: "upload" | "rename" | "delete" | "move" | "star" | string;
  details?: Record<string, string> | null;
  file_id: string | null;
  folder_id: string | null;
  item_name: string;
  item_path: string;
  item_type: "file" | "folder";
  performed_by: string;
  timestamp: string;
}

export interface DashboardContent {
  recentUploads: RecentUploadFile[];
  filesByExtensions: string[];
  recentActivities: RecentActivity[];
}
