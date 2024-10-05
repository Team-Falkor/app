interface Props<T extends any[] | string> {
  title: string;
  data: T;
}

const QuickInfoItem = <T extends any[] | string>({ title, data }: Props<T>) => {
  return (
    <li className="flex items-center justify-between p-1">
      <span className="mr-1 text-sm font-semibold">{title}</span>
      {typeof data === "string" ? (
        <span className="text-sm font-medium text-primary">{data}</span>
      ) : Array.isArray(data) ? (
        <div className="flex space-x-2">
          {data.slice(0, 2).map((item, i) => (
            <span key={i} className="text-sm font-medium text-primary">
              {item.name}
            </span>
          ))}
        </div>
      ) : null}
    </li>
  );
};

export default QuickInfoItem;
