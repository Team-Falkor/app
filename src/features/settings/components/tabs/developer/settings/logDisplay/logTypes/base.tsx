import { PropsWithChildren } from "react";

const BaseLog = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex items-center w-full gap-3 px-3 py-1">{children}</div>
  );
};

export { BaseLog };
