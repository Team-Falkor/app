import { InfoItadProps, InfoProps, infoHLTBProps } from "@/@types";
import { IGDBReturnDataType } from "@/lib/api/igdb/types";
import HLTBComponent from "../hltb";
import IGDBImage from "../IGDBImage";
import { Skeleton } from "../ui/skeleton";
import DownloadDialog from "./downloadDialog";
import QuickInfo from "./quickInfo";

type InfoTopProps = InfoProps &
  InfoItadProps & {
    data: IGDBReturnDataType | undefined;
    isReleased: boolean;
  };

type Props = InfoTopProps & infoHLTBProps;

const InfoTop = (props: Props) => {
  const {
    data,
    isReleased,
    isPending,
    error,
    itadData,
    itadError,
    itadPending,
    hltbData,
    hltbError,
    hltbPending,
  } = props;

  if (error) return null;

  return (
    <div className="sm:-mt-28 sm:flex sm:items-start sm:space-x-5">
      <div className="relative flex">
        {isPending && <Skeleton className="rounded-lg w-[230px] h-80" />}
        {!isPending && (
          <IGDBImage
            imageId={data!.cover?.image_id ?? ""}
            alt={data!.name}
            className="object-cover rounded-lg h-80"
            imageSize={"cover_big"}
          />
        )}
      </div>

      <div className="w-full mt-16 sm:min-w-0 sm:flex-1 sm:items-center sm:justify-start sm:pb-1">
        <section className="flex items-end justify-between w-full gap-3">
          {!isPending ? (
            <h1 className="text-2xl font-bold truncate">{data!.name}</h1>
          ) : (
            <Skeleton className="w-56 h-10" />
          )}

          <div className="flex justify-end gap-4">
            {!isPending ? (
              <DownloadDialog
                title={data!.name}
                isReleased={isReleased}
                websites={data!.websites}
                itadData={itadData}
                itadError={itadError}
                itadPending={itadPending}
              />
            ) : (
              <Skeleton className="w-32 h-10" />
            )}
          </div>
        </section>

        <div className="mt-5 w-full h-full gap-3.5 justify-between flex flex-col">
          <QuickInfo
            data={data}
            error={error}
            isPending={isPending}
            isReleased={isReleased}
          />

          {!!hltbData && !hltbError && !hltbPending && (
            <div className="w-full ">
              <HLTBComponent
                times={[
                  Math.floor(hltbData.comp_main / 60 / 60),
                  Math.floor(hltbData.comp_plus / 60 / 60),
                  Math.floor(hltbData.comp_100 / 60 / 60),
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoTop;
