import { InfoProps } from "@/@types";
import GameMedia from "@/components/info/media";
import SimilarGames from "@/components/info/similar";
import PcSpecs from "@/components/info/specs";
import { InfoReturn } from "@/lib/api/igdb/types";
import { useOS } from "@/stores/settings";
import { useMemo } from "react";

const InfoBottom = (props: InfoReturn & InfoProps) => {
  const { platform } = useOS();
  const { similar_games } = props;

  const findRequirements = useMemo(() => {
    if (!props.steam?.data) return;
    if (platform === "unknown") return;

    // const data = props.steam?.data;

    return props.steam?.data.pc_requirements;
  }, [platform]);

  return (
    <div className="flex flex-col gap-6 mt-5">
      <SimilarGames data={similar_games} />

      <GameMedia {...props} />

      <PcSpecs {...findRequirements} />
    </div>
  );
};

export default InfoBottom;
