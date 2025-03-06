# ![apple-touch-icon](https://github.com/user-attachments/assets/1b8a540b-0cde-4f4f-ac9e-443966a6be70)
# Cloud.e

Cloude is a cloud storage web app similar to Google Drive, built using Next.js 15 with TypeScript. It enables users to upload, manage, and share files and folders seamlessly. With features like starred items and search functionality, Cloude provides a minimal yet powerful user experience.

## Features

### 1. File & Folder Upload
- Upload single or multiple files at once (supports all formats: media, docs, etc.).
- Upload entire folders, including nested files and subfolders, while maintaining hierarchy.

### 2. File & Folder Sharing
- Share files or folders with other users by entering their email.
- Shared items appear in the recipient's storage if they have an account.

### 3. Starred Items
- Users can mark files or folders as starred for quick access.


4. Search Functionality
- Search for files or folders (own or shared) using name, type, or extension (e.g., .pdf, .jpg).

## Technologies Used
- **Framework:** Next.js 15 with TypeScript
- **Database & Storage:** Supabase (for database, storage, and authentication)
- **Styling:** TailwindCSS
- **Deployment:** Vercel

## Live Demo
[Check out the live app here](https://cloude-next.vercel.app/cloude/home/dashboard)

## Getting Started
### Installation
```bash
# Clone the repository
https://github.com/prvnlhr/cloude_next.git

# Install dependencies
npm install
```

### Running the Project
```bash
# Start the development server
yarn dev  # or npm run dev
```

## App Overview
### Layout
- **Sidebar:** Navigation to different sections (Dashboard, My Storage, Shared, Starred).
- **Main View:** Displays the selected page’s content.

### Dashboard
- Shows recently uploaded files, categorized storage, and activity logs.

### My Storage
- Displays all files and folders uploaded by the user.
- Organized into separate sections for Folders and Files.

### Uploading Files & Folders
- Users can upload single/multiple files and folders.
- Uploaded content appears in My Storage immediately.

## Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.

