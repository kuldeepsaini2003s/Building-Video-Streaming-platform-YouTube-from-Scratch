import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_PLAYLIST } from "../utils/constants";
import { IoMdGlobe } from "react-icons/io";
import { LockKeyhole } from "lucide-react";

export const UserAllVideo = () => {
  const [videos, setVideos] = useState([]);
  const userAllVideos = useSelector((store) => store.videos.allVideos);

  useEffect(() => {
    if (userAllVideos && userAllVideos.length > 0) {
      setVideos(userAllVideos);
    } else {
      setVideos([]);
    }
  }, [userAllVideos]);
  return (
    <div className="grid max-sm:grid-cols-1 gap-3 sm:grid-cols-2 ml:m-2   lg:grid-cols-3 mt-4">
      {videos && videos.length > 0 ? (
        videos.map((item) => (
          <Link key={item.id} to={"/update-video/" + item?.video_id}>
            <VideoCard info={item} />
          </Link>
        ))
      ) : (
        <div>No videos found</div>
      )}
    </div>
  );
};
export const UserPlaylist = () => {
  const [playlist, setPlaylist] = useState([]);
  const user = useSelector((store) => store?.user?.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          BACKEND_PLAYLIST + `/userPlaylist/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setPlaylist(response?.data?.data);
        }
      } catch (error) {
        console.error("Error while fetching user playlist", error);
      }
    };
    if (user._id) {
      fetchData();
    }
  }, [user._id]);
  return (
    <div className="grid grid-cols-5 gap-2 mt-4">
      {playlist ? (
        playlist?.map((item) => (
          <div className="relative space-y-[2px] h-40">
            <div className="flex flex-col justify-center items-center">
              <div className="w-[88%] border-b-4 border-l-transparent border-r-transparent border-l-4 border-r-4 mb-[1px] border-[#514842]"></div>
              <div className="w-[93%] border-b-4 border-l-transparent border-r-transparent border-l-4 border-r-4   border-[#938176]"></div>
              <div className="relative w-full">
              <img
                src={item?.thumbnail}
                className="w-full h-32 object-cover object-center rounded-md bg-yellow-500"
              ></img>              
              <div></div>
              </div>
            </div>
            <div className="w-[90%]">
              <h1 className="text-sm line-clamp-2 font-medium mt-2">{item?.title}</h1>
              <div className="flex justify-between font-medium items-center text-Lightblack text-xs">
                <h1>View full playlist</h1>
                {item.owner === user._id && (
                  <h1 className="flex gap-1 items-center">
                    {item?.status === "Private" ? (
                      <LockKeyhole strokeWidth={3} size={12} />
                    ) : (
                      <IoMdGlobe />
                    )}
                    {item?.status}
                  </h1>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No playlist create yet.</p>
      )}
    </div>
  );
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
