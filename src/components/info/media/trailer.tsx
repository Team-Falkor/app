import { Video } from "@/lib/api/igdb/types";

interface MediaTrailerProps {
  videos: Video[] | undefined;
}

const MediaTrailer = ({ videos }: MediaTrailerProps) => {
  if (!videos?.length) return null;

  return (
    <iframe
      className="aspect-video h-[500px] w-full rounded-lg"
      src={`https://www.youtube.com/embed/${videos?.[0].video_id}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default MediaTrailer;
