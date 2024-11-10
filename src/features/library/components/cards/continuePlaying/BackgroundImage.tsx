interface BackgroundImageProps {
  bgImage: string;
  className?: string;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({
  bgImage,
  className,
}) => {
  const isRemoteImage = /^https?:\/\//i.test(bgImage);
  const realImagePath = isRemoteImage ? bgImage : `local:${bgImage}`;

  return (
    <div
      className={`${className} bg-cover bg-center`}
      style={{
        backgroundImage: `url(${realImagePath})`,
      }}
    />
  );
};

export default BackgroundImage;
