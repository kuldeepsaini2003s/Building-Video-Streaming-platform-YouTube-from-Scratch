import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import ShimmerCard from "./ShimmerCard";
import { useSelector } from "react-redux";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((store) => store.user.user);

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
    <div
      id="main"
      className="grid max-sm:grid-cols-1 sm:grid-cols-2 ml:m-2 lg:m-0  lg:grid-cols-3"
    >
      {user ? (
        isLoading ? (
          <ShimmerCard />
        ) : (
          videos?.map((video) => (
            <Link key={video.id} to={"/watch?v=" + video.id}>
              <VideoCard info={video} />
            </Link>
          ))
        )
      ) : (
        <div className="flex justify-center items-center w-full">
          <Link to={"/login"}>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 outline-none">
              Please Sign in
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default VideoContainer;
