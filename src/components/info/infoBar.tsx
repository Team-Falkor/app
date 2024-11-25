import React from "react";
import { Topbar } from "./topbar";

interface InfoBarProps {
  onBack: () => void;
  titleText: string;
  onAddToList: () => void;
}

export const InfoBar: React.FC<InfoBarProps> = ({
  onBack,
  titleText,
  onAddToList,
}) => (
  <div className="relative z-10 w-full">
    <Topbar onBack={onBack} titleText={titleText} onAddToList={onAddToList} />
  </div>
);
