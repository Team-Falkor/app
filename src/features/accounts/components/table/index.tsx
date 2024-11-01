import { ExternalAccount } from "@/@types/accounts";
import { invoke } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const AccountsTable = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["accounts", "all"],
    queryFn: async () => {
      const data = invoke<Array<ExternalAccount>, string | undefined>(
        "external-accounts:get-all"
      );

      return data;
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AccountsTable;
