
import React, { useEffect, useState } from 'react';
import { YOUTUBE_VIDEOS_API } from '../utils/constants';
import { Link } from 'react-router-dom';
import VideoCard from './VideoCard';
import ShimmerCard from './ShimmerCard';

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  const getVideos = async () => {
    const data = await fetch (YOUTUBE_VIDEOS_API)
    const json = await data.json();
    console.log(json);
    setVideos(json.items);
    setIsLoading(false); // Set loading to false once data is loaded
  }

  useEffect(() => {
    getVideos();
  }, []);

  return (
    <div className="flex fixed -z-50 top-[7rem] overflow-y-auto max-h-screen  w-full left-[3rem] flex-wrap gap-2 justify-center">
      {isLoading ? (
          <ShimmerCard/>
      ) : (
        videos.map((video) => (
          <Link key={video.id} to={"/watch?v=" + video.id}>
            <VideoCard info={video} />
          </Link>
        ))
      )}
    </div>
  )
}

export default VideoContainer
