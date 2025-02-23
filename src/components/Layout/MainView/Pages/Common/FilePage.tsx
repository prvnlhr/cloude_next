import { useOutletContext } from "react-router-dom";

interface ContextType {
  files: any[];
}
const FilePage = () => {
  const { files } = useOutletContext<ContextType>();
  console.log(" files:", files);
  return <div className="w-full h-full border border-green-600"></div>;
};

export default FilePage;
