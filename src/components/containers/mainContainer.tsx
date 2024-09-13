import { PropsWithChildren } from "react";

const MainContainer = ({ children }: PropsWithChildren) => {
  return <div className="p-6 lg:px-10">{children}</div>;
};

export default MainContainer;
