import { useEffect, useState } from "react";
import { BACKEND_VIDEO } from "../utils/constants";
import VideoCard from "./VideoCard";
import { useParams } from "react-router";
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
    <div className="grid grid-cols-4 mt-4">
      {videos && videos.length > 0 ? (
        <VideoCard info={videos} />
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
