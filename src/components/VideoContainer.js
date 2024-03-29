import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import ShimmerCard from "./ShimmerCard";
import { useSelector } from "react-redux";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getVideos = useSelector((store) => store.videos.youtubevideo);

  useEffect(()=>{
    if(getVideos && getVideos.length > 0){
      setVideos(getVideos)
      setIsLoading(false)
    }
  },[getVideos])
  
  return (
    <div className="flex fixed -z-50 sm:top-[8rem] overflow-y-auto max-h-screen  w-full sm:left-[3.2rem] flex-wrap sm:gap-2 mm:gap-5 justify-center mm:top-16 mm:left-0 ">
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
