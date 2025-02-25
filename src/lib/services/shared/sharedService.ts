const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function shareContent(shareContentData) {
  try {
    const formData = new FormData();
    formData.append("itemId", shareContentData.itemId);
    formData.append("itemType", shareContentData.itemType);
    formData.append("userId", shareContentData.userId);
    formData.append("shareWithEmail", shareContentData.shareWithEmail);
    const shareResponse = await fetch(`${BASE_URL}/api/share/`, {
      method: "POST",
      body: formData,
    });
    if (!shareResponse.ok) {
      throw new Error("Failed to share content.");
    }
    const data = await shareResponse.json();
    return data;
  } catch (error) {
    console.error("Error sharing content:", error);
    throw new Error(`Failed to share content: ${error.message}`);
  }
}

// export async function getSharedContent(userId, folderId) {
//   try {
//     const params = new URLSearchParams({
//       userId: encodeURIComponent(userId),
//       folderId: folderId ? encodeURIComponent(folderId) : "null",
//     });

//     const response = await fetch(`${BASE_URL}/api/share?${params.toString()}`);

//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
//     }
//     const data = await response.json();

//     console.log("XX", data);

//     if (folderId) {
//       const mappedFiles =
//         data.files?.map((file) => ({
//           id: file.id,
//           file_name: file.file_name,
//           file_size: file.file_size,
//           file_type: file.file_type,
//           created_at: file.created_at,
//           folder_id: file.folder_id,
//           is_shared: file.is_shared,
//           is_starred: file.is_starred,
//           storage_path: file.storage_path,
//           thumbnail_url: file.thumbnail_url,
//           updated_at: file.updated_at,
//           user_id: file.user_id,
//         })) || [];

//       const mappedFolders =
//         data.folders?.map((folders) => ({
//           id: folders.id,
//           folder_name: folders.folder_name,
//           created_at: folders.created_at,
//           is_shared: folders.is_shared,
//           is_starred: folders.is_starred,
//           parent_folder_id: folders.parent_folder_id,
//           slug: folders.slug,
//           updated_at: folders.updated_at,
//           user_id: folders.user_id,
//         })) || [];

//       return {
//         files: mappedFiles,
//         folders: mappedFolders,
//       };
//     } else {
//       const mappedFiles =
//         data.files?.map((file) => ({
//           id: file.files.id,
//           file_name: file.files.file_name,
//           file_size: file.files.file_size,
//           file_type: file.files.file_type,
//           created_at: file.files.created_at,
//           folder_id: file.files.folder_id,
//           is_shared: file.files.is_shared,
//           is_starred: file.files.is_starred,
//           storage_path: file.files.storage_path,
//           thumbnail_url: file.files.thumbnail_url,
//           updated_at: file.files.updated_at,
//           user_id: file.files.user_id,
//         })) || [];

//       const mappedFolders =
//         data.folders?.map((folder) => ({
//           id: folder.folders.id,
//           folder_name: folder.folders.folder_name,
//           created_at: folder.folders.created_at,
//           is_shared: folder.folders.is_shared,
//           is_starred: folder.folders.is_starred,
//           parent_folder_id: folder.folders.parent_folder_id,
//           slug: folder.folders.slug,
//           updated_at: folder.folders.updated_at,
//           user_id: folder.folders.user_id,
//         })) || [];

//       return {
//         files: mappedFiles,
//         folders: mappedFolders,
//       };
//     }

//   } catch (error) {
//     console.error("Failed to get shared content:", error);
//     throw new Error(`Failed to get shared content: ${error.message}`);
//   }
// }

export async function getSharedContent(userId, folderId) {
  try {
    const params = new URLSearchParams({
      userId: encodeURIComponent(userId),
      folderId: folderId ? encodeURIComponent(folderId) : "null",
    });

    const response = await fetch(`${BASE_URL}/api/share?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const mapFiles = (filesArray, nested = false) => {
      return (
        filesArray?.map((file) => {
          const f = nested ? file.files : file;
          return {
            id: f.id,
            file_name: f.file_name,
            file_size: f.file_size,
            file_type: f.file_type,
            created_at: f.created_at,
            folder_id: f.folder_id,
            is_shared: f.is_shared,
            is_starred: f.is_starred,
            storage_path: f.storage_path,
            thumbnail_url: f.thumbnail_url,
            updated_at: f.updated_at,
            user_id: f.user_id,
          };
        }) || []
      );
    };

    const mapFolders = (foldersArray, nested = false) => {
      return (
        foldersArray?.map((folder) => {
          const f = nested ? folder.folders : folder;
          return {
            id: f.id,
            folder_name: f.folder_name,
            created_at: f.created_at,
            is_shared: f.is_shared,
            is_starred: f.is_starred,
            parent_folder_id: f.parent_folder_id,
            slug: f.slug,
            updated_at: f.updated_at,
            user_id: f.user_id,
          };
        }) || []
      );
    };

    const isNested = !folderId;
    const mappedFiles = mapFiles(data.files, isNested);
    const mappedFolders = mapFolders(data.folders, isNested);

    return {
      files: mappedFiles,
      folders: mappedFolders,
    };
  } catch (error) {
    console.error("Failed to get shared content:", error);
    throw new Error(`Failed to get shared content: ${error.message}`);
  }
}
