import { igdb } from "@/lib";
import { goBack } from "@/lib/history";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import DefaultCard from "../cards/defaultCard";
import Spinner from "../spinner";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import MainContainer from "./mainContainer";

type Props = {
  title: string;
  dataToFetch: "mostAnticipated" | "topRated" | "newReleases";
};
export const Section = ({ title, dataToFetch }: Props) => {
  const limit = 50;
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);

  const fetcher = async () => {
    const data = await igdb[dataToFetch](limit, offset);
    return data;
  };

  const { data, isPending, error } = useQuery({
    queryKey: ["igdb", dataToFetch, "all", page],
    queryFn: fetcher,
  });

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
    setOffset((prev) => prev + limit);
  };

  const handlePrevPage = () => {
    setPage((prev) => (prev === 1 ? prev : prev - 1));
    setOffset((prev) => (prev === 0 ? prev : prev - limit));
  };

  if (isPending)
    return (
      <div className="w-full flex items-center justify-center h-[calc(100vh-2rem)]">
        <Spinner size={23} />
      </div>
    );
  if (error) {
    window.location.reload();
    return null;
  }

  return (
    <MainContainer
      id={`${dataToFetch}-section`}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => goBack()}
          className="mt-1"
        >
          <ChevronLeft className="size-8" />
        </Button>

        <h2 className="scroll-m-20 text-4xl font-bold tracking-tight first:mt-0">
          {title}
        </h2>
      </div>
      <Separator className="-mt-1" />

      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        {data?.map((game) => <DefaultCard key={game.id} {...game} />)}
      </div>

      <div className="flex flex-1 justify-between mt-4">
        <Button
          variant={"ghost"}
          onClick={handlePrevPage}
          disabled={page === 1}
          size={"icon"}
        >
          <ChevronLeft />
        </Button>

        <span className="text-muted-foreground text-lg">Page {page}</span>

        <Button variant={"ghost"} onClick={handleNextPage} size={"icon"}>
          <ChevronRight />
        </Button>
      </div>
    </MainContainer>
  );
};
