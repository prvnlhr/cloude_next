const CustomToast = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <p className="text-[#1C3553] text-[0.9rem] font-semibold">{title}</p>
      {description && (
        <p className="text-[#708090] text-[0.9rem] font-medium line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );
};

export default CustomToast;
