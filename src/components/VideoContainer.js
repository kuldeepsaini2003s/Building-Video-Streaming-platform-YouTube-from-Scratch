import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import ShimmerCard from "./ShimmerCard";
import { useSelector } from "react-redux";
import { interval } from "date-fns/interval";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { youtubevideo, categories, fetchcategories } = useSelector(
    (store) => store.videos
  );  

  useEffect(() => {
    if (fetchcategories === "") {
      setVideos(youtubevideo);
      setIsLoading(false)
    } else {      
      setVideos(categories);
      setIsLoading(false);
    }
  }, [categories, youtubevideo, fetchcategories]);

  return (
    <div className="sm:flex fixed -z-50 sm:top-[8rem] overflow-y-auto max-h-screen bottom-0 pb-10 w-full sm:left-[3.2rem] ms:left-0 flex-wrap sm:gap-2 ms:gap-0 sm:justify-center ms:top-28 ms:left-0 ms:w-full">
      {isLoading ? (
        <ShimmerCard />
      ) : (
        videos?.map((video) => (
          <Link key={video.id} to={"/watch?v=" + video.id}>
            <VideoCard info={video} />
          </Link>
        ))
      )}
    </div>
  );
};

export default VideoContainer;
