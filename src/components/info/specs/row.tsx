import { Data } from "@/components/info/specs";
import { scrapeOptions } from "@/lib";

type RequirementsRowProps = Data;

const RequirementsRow = ({ type, data }: RequirementsRowProps) => {
  if (!data) return null;

  const specs = scrapeOptions(data);

  return (
    <ul className="w-1/2 py-4 bg-white border-gray-200 divide-gray-200 rounded-lg dark:divide-gray-700 dark:border-gray-700 dark:bg-muted dark:text-gray-100">
      <h3 className="p-4 pt-1 pb-2 text-lg font-bold leading-6 capitalize text-primary">
        {type}
      </h3>

      {Object.entries(specs).map(([key, value]) => (
        <li className="flex flex-col justify-between gap-1 p-4 py-1">
          <span className="text-xs font-medium text-slate-400">{key}</span>
          <span className="mr-1 text-sm">{value[0]}</span>
        </li>
      ))}
    </ul>
  );
};

export default RequirementsRow;
