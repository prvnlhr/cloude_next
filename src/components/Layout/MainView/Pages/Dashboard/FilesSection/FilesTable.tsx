type File = {
  Name: string;
  owner: string;
  "date Uploaded": string;
  size: string;
  location: string;
  "file type": string; // Type of file (e.g., PDF, ZIP, DOCX, etc.)
  shared: boolean; // Indicates if the file is shared
  tags: string[]; // Array of tags related to the file
};
const files: File[] = [
  {
    Name: "Report_Q1.pdf",
    owner: "John Doe",
    "date Uploaded": "2023-02-14",
    size: "2MB",
    location: "Invoice 2023",
    "file type": "PDF",
    shared: true,
    tags: ["report", "finance"],
  },
  {
    Name: "Vacation_Photos.zip",
    owner: "Alice Johnson",
    "date Uploaded": "2023-06-21",
    size: "15MB",
    location: "Vacation Bali",
    "file type": "ZIP",
    shared: false,
    tags: ["vacation", "photos"],
  },
  {
    Name: "UI_Kit.sketch",
    owner: "Michael Smith",
    "date Uploaded": "2022-11-02",
    size: "8MB",
    location: "UI Designs",
    "file type": "Sketch",
    shared: true,
    tags: ["design", "ui"],
  },
  {
    Name: "Episode_5.mp3",
    owner: "Emily Brown",
    "date Uploaded": "2023-05-09",
    size: "25MB",
    location: "Podcast Episodes",
    "file type": "MP3",
    shared: true,
    tags: ["podcast", "audio"],
  },
  {
    Name: "Lecture_Slides.pptx",
    owner: "David Lee",
    "date Uploaded": "2023-03-19",
    size: "3MB",
    location: "Course Materials",
    "file type": "PPTX",
    shared: false,
    tags: ["lecture", "education"],
  },
  {
    Name: "Client_Feedback_Document.docx",
    owner: "Sophia White",
    "date Uploaded": "2023-04-27",
    size: "1.5MB",
    location: "Client Feedback",
    "file type": "DOCX",
    shared: true,
    tags: ["feedback", "client"],
  },
  {
    Name: "Pitch_Deck.pdf",
    owner: "Chris Johnson",
    "date Uploaded": "2023-01-11",
    size: "4MB",
    location: "Startup Pitch",
    "file type": "PDF",
    shared: false,
    tags: ["pitch", "startup"],
  },
  {
    Name: "Recipe_Book.pdf",
    owner: "Olivia Green",
    "date Uploaded": "2023-07-03",
    size: "2.5MB",
    location: "Recipe Collection",
    "file type": "PDF",
    shared: true,
    tags: ["recipe", "cooking"],
  },
  {
    Name: "Event_Budget.xlsx",
    owner: "Daniel Scott",
    "date Uploaded": "2023-08-15",
    size: "1MB",
    location: "Event Planning",
    "file type": "XLSX",
    shared: false,
    tags: ["budget", "event"],
  },
  {
    Name: "Research_Notes.txt",
    owner: "Emma Thompson",
    "date Uploaded": "2023-09-10",
    size: "500KB",
    location: "Research Notes",
    "file type": "TXT",
    shared: true,
    tags: ["research", "notes"],
  },
  {
    Name: "Research_Notes.txt",
    owner: "Emma Thompson",
    "date Uploaded": "2023-09-10",
    size: "500KB",
    location: "Research Notes",
    "file type": "TXT",
    shared: true,
    tags: ["research", "notes"],
  },
  {
    Name: "Research_Notes.txt",
    owner: "Emma Thompson",
    "date Uploaded": "2023-09-10",
    size: "500KB",
    location: "Research Notes",
    "file type": "TXT",
    shared: true,
    tags: ["research", "notes"],
  },
  {
    Name: "Research_Notes.txt",
    owner: "Emma Thompson",
    "date Uploaded": "2023-09-10",
    size: "500KB",
    location: "Research Notes",
    "file type": "TXT",
    shared: true,
    tags: ["research", "notes"],
  },
  {
    Name: "Research_Notes.txt",
    owner: "Emma Thompson",
    "date Uploaded": "2023-09-10",
    size: "500KB",
    location: "Research Notes",
    "file type": "TXT",
    shared: true,
    tags: ["research", "notes"],
  },
  {
    Name: "Research_Notes.txt",
    owner: "Emma Thompson",
    "date Uploaded": "2023-09-10",
    size: "500KB",
    location: "Research Notes",
    "file type": "TXT",
    shared: true,
    tags: ["research", "notes"],
  },
  {
    Name: "Research_Notes.txt",
    owner: "Emma Thompson",
    "date Uploaded": "2023-09-10",
    size: "500KB",
    location: "Research Notes",
    "file type": "TXT",
    shared: true,
    tags: ["research", "notes"],
  },
  {
    Name: "Research_Notes.txt",
    owner: "Emma Thompson",
    "date Uploaded": "2023-09-10",
    size: "500KB",
    location: "Research Notes",
    "file type": "TXT",
    shared: true,
    tags: ["research", "notes"],
  },
];
const FilesTable = () => {
  const columns = Object.keys(files[0]) as (keyof File)[];

  return (
    <div
      className="w-full h-full overflow-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <table className="min-w-full border-collapse">
        {/* Table Head */}
        <thead className="bg-[#EEEEEE] sticky top-0 z-10">
          <tr className="text-left text-[#1C3553] text-[0.8rem]">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 capitalize whitespace-nowrap border-x-[1px] border-[#E4E4E4]"
              >
                {col}
              </th>
            ))}
            <th className="px-4 py-2 capitalize whitespace-nowrap border-x-[1px] border-[#E4E4E4]">
              Action
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {files.map((file, index) => (
            <tr
              key={index}
              className="border border-[#E4E4E4] hover:bg-gray-100"
            >
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-4 py-2 border border-[#E4E4E4] whitespace-nowrap text-[#1C3553] text-[0.8rem]"
                >
                  {Array.isArray(file[col]) ? file[col].join(", ") : file[col]}
                </td>
              ))}
              <td className="px-4 py-2 border border-[#E4E4E4] whitespace-nowrap text-[#1C3553] text-[0.8rem]"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilesTable;
