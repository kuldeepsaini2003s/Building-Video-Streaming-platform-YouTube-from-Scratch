import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { useSelector } from "react-redux";

export const UserAllVideo = () => {
  const [videos, setVideos] = useState([]);
  const userAllVideos = useSelector((store) => store.videos.userVideos);

  useEffect(() => {
    if (userAllVideos && userAllVideos.length > 0) {
      setVideos(userAllVideos);
    } else {
      setVideos([]);
    }
  }, [userAllVideos]);
  return (
    <div className="grid max-sm:grid-cols-1 sm:grid-cols-2 ml:m-2   lg:grid-cols-3 mt-4">
      {videos && videos.length > 0 ? (
        videos.map((item) => <VideoCard info={item} />)
      ) : (
        <div>No videos found</div>
      )}
    </div>
  );
};
export const UserPlaylist = () => {
  return <div>User all playlists</div>;
};
export const UserCommunity = () => {
  return <div>User all community</div>;
};
export const UserAbout = () => {
  return <div>User all about</div>;
};

const userChannelCollection = {
  UserAllVideo,
  UserPlaylist,
  UserCommunity,
  UserAbout,
};
export default userChannelCollection;
