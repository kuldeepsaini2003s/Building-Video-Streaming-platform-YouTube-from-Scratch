import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import ShimmerCard from "./ShimmerCard";
import { useSelector } from "react-redux";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getVideos = useSelector((store) => store.videos.youtubevideo);
  console.log(getVideos)

  useEffect(() => {
    if (getVideos && getVideos.length > 0) {
      setVideos(getVideos);
      setIsLoading(false);
    }
  }, [getVideos]);

  console.log(videos)

  return (
    <div className="sm:flex fixed -z-50 sm:top-[8rem] overflow-y-auto max-h-screen  w-full sm:left-[3.2rem] ms:left-0 flex-wrap sm:gap-2 ms:gap-0 sm:justify-center ms:top-28 ms:left-0 ms:w-full">
      {isLoading ? (
        <ShimmerCard />
      ) : (
        videos.map((video) => (
          <Link key={video.id} to={"/watch?v=" + video.id}>
            <VideoCard info={video} />
          </Link>
        ))
      )}
    </div>
  );
};

export default VideoContainer;
