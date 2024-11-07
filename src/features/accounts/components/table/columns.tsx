import { ExternalAccountColumn } from "@/@types/accounts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ExternalAccountColumn>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-start pl-3">
          <Avatar className="size-7">
            <AvatarImage
              src={row?.original?.avatar ?? undefined}
              alt={row?.original?.username ?? undefined}
            />
            <AvatarFallback>{row.original.username?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "access_token",
    header: "Access Token",
    cell: ({ row }) => {
      return (
        <span className="text-xs text-muted-foreground">
          {row.original.access_token.slice(0, 2)}
          ...
          {row.original.access_token.slice(-5)}
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <span className="capitalize">
          {row.original.type.replace("-", " ")}
        </span>
      );
    },
  },
];
