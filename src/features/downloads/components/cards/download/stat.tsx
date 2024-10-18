interface Props {
  title: string;
  text: string;
}

const DownloadCardStat = ({ text, title }: Props) => {
  return (
    <div className="flex flex-col gap-0.5">
      <h1 className="font-bold text-foreground">{text}</h1>
      <p className="text-muted-foreground text-xs uppercase font-semibold">
        {title}
      </p>
    </div>
  );
};

export default DownloadCardStat;
