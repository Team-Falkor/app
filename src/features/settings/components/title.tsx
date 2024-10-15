interface SettingTitleProps {
  children: string;
}

const SettingTitle = ({ children }: SettingTitleProps) => {
  return (
    <div className="p-7 pb-5">
      <h1 className="text-xl font-bold">{children}</h1>
    </div>
  );
};

export default SettingTitle;
