import { PropsWithChildren } from "react";

const MainContainer = ({ children }: PropsWithChildren) => {
  return <div className="p-6">{children}</div>;
};

export default MainContainer;
