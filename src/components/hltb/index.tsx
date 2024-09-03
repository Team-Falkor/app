type TupMinMax<T, Min extends number, Max extends number> = T[] & {
  length: Min | Max;
};

interface Props {
  times: TupMinMax<number, 1, 3>;
}

const HLTBComponent = ({ times }: Props) => {
  const total = times.reduce((acc, time) => {
    return acc + time;
  }, 0);

  const percentageColors = [
    "bg-purple-400",
    "bg-blue-400",
    "bg-cyan-400",
  ] as const;

  return (
    <div className="w-full overflow-hidden rounded-sm">
      <div className="flex flex-row">
        {times.map((time, index) => (
          <div
            key={index}
            style={{ width: `${(time / total) * 100}%` }}
            className={`${percentageColors[index]} flex flex-row items-center justify-center p-2 text-white`}
          >
            <span className="text-lg font-bold text-primary">{time} hours</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HLTBComponent;
