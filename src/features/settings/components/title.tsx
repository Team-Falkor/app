interface SettingTitleProps {
  children: string;
}

const SettingTitle = ({ children }: SettingTitleProps) => {
  return (
    <div className="p-3 px-4 border-b">
      <h1 className="text-xl font-bold">{children}</h1>
    </div>
  );
};

export default SettingTitle;
