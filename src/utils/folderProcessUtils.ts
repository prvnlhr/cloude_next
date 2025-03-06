export type UploadFolderData = {
  id: string;
  name: string;
  parentFolderId: string | null;
  userId: string;
};

export type UploadFileData = {
  name: string;
  type: string;
  size: number;
  folderId: string;
  userId: string;
  file: File;
};

export const processFolderInput = (
  files: FileList,
  userId: string,
  rootParentFolderId: string | null = null
): { foldersArray: UploadFolderData[]; filesArray: UploadFileData[] } => {
  const foldersArray: UploadFolderData[] = [];
  const filesArray: UploadFileData[] = [];
  const folderMap: Record<string, string> = {};

  // Helper function to create a folder
  const createFolder = (folderName: string, parentFolderId: string | null) => {
    const folder: UploadFolderData = {
      id: crypto.randomUUID(),
      name: folderName,
      parentFolderId,
      userId,
    };
    foldersArray.push(folder);
    return folder;
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = file.webkitRelativePath;
    const pathParts = relativePath.split("/");

    // Loop the folders
    let currentFolderId: string | null = rootParentFolderId;
    let currentPath = "";

    for (let j = 0; j < pathParts.length - 1; j++) {
      const folderName = pathParts[j];
      currentPath += `${folderName}/`;

      if (!folderMap[currentPath]) {
        const folder = createFolder(folderName, currentFolderId);
        folderMap[currentPath] = folder.id;
        currentFolderId = folder.id;
      } else {
        currentFolderId = folderMap[currentPath];
      }
    }

    // Add the file of this folder to the filesArray
    const fileName = pathParts[pathParts.length - 1];
    filesArray.push({
      name: fileName,
      type: file.type,
      size: file.size,
      folderId: currentFolderId || crypto.randomUUID(),
      userId,
      file,
    });
  }

  return { foldersArray, filesArray };
};
