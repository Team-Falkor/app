interface TitleProps {
  text: string;
}

export const Title = ({ text }: TitleProps) => (
  <h1 className="font-bold leading-tight truncate">{text}</h1>
);
