interface Props {
  title: string;
}

const DownloadCardTitle = ({ title }: Props) => {
  return <h1 className="text-xl font-bold text-foreground">{title}</h1>;
};

export default DownloadCardTitle;
