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
      setIsLoading(false);
    } else {
      setVideos(categories);
      setIsLoading(false);
    }
  }, [categories, youtubevideo, fetchcategories]);

  return (
    <div id="main" className="grid grid-cols-3 grid-flow-row">
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
