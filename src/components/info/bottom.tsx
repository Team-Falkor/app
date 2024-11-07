import { InfoProps } from "@/@types";
import GameMedia from "@/components/info/media";
import SimilarGames from "@/components/info/similar";
import PcSpecs from "@/components/info/specs";
import { InfoReturn } from "@/lib/api/igdb/types";

const InfoBottom = (props: InfoReturn & InfoProps) => {
  const { similar_games } = props;

  return (
    <div className="flex flex-col gap-6 mt-5">
      <SimilarGames data={similar_games} />

      <GameMedia {...props} />

      <PcSpecs {...props.steam?.data?.pc_requirements} />
    </div>
  );
};

export default InfoBottom;
