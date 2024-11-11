import TitleBarControl from "./control";

const TitleBarTrafficLights = () => {
  return (
    <>
      <TitleBarControl
        className="fill-yellow-400 group-hover:fill-yellow-500 group-focus-visible:fill-yellow-500"
        type="minimize"
      />
      <TitleBarControl
        className="fill-green-400 group-hover:fill-green-500 group-focus-visible:fill-green-500"
        type="maximize"
      />
      <TitleBarControl
        className="fill-red-400 group-hover:fill-red-500 group-focus-visible:fill-red-500"
        type="close"
      />
    </>
  );
};

export default TitleBarTrafficLights;
