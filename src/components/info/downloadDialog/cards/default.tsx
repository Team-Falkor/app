import { PluginSearchResponse } from "@/@types";
import { DownloadIcon, UserIcon, Users2Icon } from "lucide-react";

const DefaultDownloadCard = (props: PluginSearchResponse) => {
  if (props.type === "ddl") return null;

  if (!props.return) return null;

  return (
    <button
      key={props.return}
      className="flex flex-col items-start justify-center w-full gap-2 text-sm cursor-pointer group text-start hover:opacity-60"
    >
      {props.name}

      <div className="flex flex-row items-center justify-start w-full gap-3">
        <div className="flex items-center gap-1 text-xs text-slate-300 capitalize">
          <DownloadIcon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
          {props?.type ?? "??"}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-300 capitalize">
          <UserIcon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
          {props?.uploader ?? "??"}
        </div>{" "}
        <div className="flex items-center gap-1 text-xs text-slate-300 capitalize">
          <Users2Icon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
          {props?.seeds ?? "??"}
        </div>
      </div>
    </button>
  );
};

export default DefaultDownloadCard;
