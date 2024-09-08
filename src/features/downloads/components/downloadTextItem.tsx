interface DownloadTextItemProps {
  text1: string;
  text2: string;
}

const DownloadTextItem = ({ text1, text2 }: DownloadTextItemProps) => {
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-md -mb-0.5 font-bold capitalize">{text1}</h1>
      <p className="text-xs text-secondary-foreground/50">{text2}</p>
    </div>
  );
};

export default DownloadTextItem;
