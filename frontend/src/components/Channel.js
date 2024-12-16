import React, { useEffect, useState } from "react";
import { FiBell, FiBellOff } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { BACKEND_USER } from "../utils/constants";

const channelNavigation = [
  {
    name: "Videos",
    path: "/channel/videos",
  },
  {
    name: "Playlists",
    path: "/channel/playlists",
  },
  {
    name: "Community",
    path: "/channel/community",
  },
  {
    name: "About",
    path: "/channel/about",
  },
];
const Channel = () => {
  const { id } = useParams();
  const [channelDetails, setChannelDetails] = useState({});
  const [videos, setVideos] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          BACKEND_USER + `/getChannelDetails/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          setChannelDetails(data?.data);
        }
      } catch (error) {
        console.log("error while fetching user channel details", error);
      }
    };
    fetchUserDetails();
  }, [id]);

  useEffect(() => {
    const fetchUserVideos = async () => {
      const response = await fetch();
      const data = await response.json();
      if (response.status === 200) {
        setVideos(data?.data);
      }
    };
    fetchUserVideos();
  }, [id]);

  const [isActive, setIsActive] = useState("Videos");

  return (
    <div id="main">
      {channelDetails?.coverImage && (
        <img src="" className="h-36 rounded-xl" alt="" />
      )}
      <div className="flex gap-5 my-5">
        <div className="flex-shrink-0">
          <img
            src={channelDetails?.avatar}
            className="w-40 h-40 object-cover object-center rounded-full border"
            alt=""
          />
        </div>
        <div className="flex-grow space-y-1">
          <h1 className="text-2xl font-bold ">{channelDetails?.channelName}</h1>
          <div className="font-semibold flex gap-2 items-center">
            <h1>{channelDetails?.userName}</h1>
            <p>{channelDetails?.subscribersCount} subscribers</p>
            <p>{channelDetails?.videoCount} videos</p>
          </div>
          <p>{channelDetails?.description}</p>
          <button className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            {!channelDetails?.subscribed ? (
              <>
                {" "}
                <FiBell className="w-5 h-5" />
                <span>Subscribe</span>{" "}
              </>
            ) : (
              <>
                {" "}
                <FiBellOff className="w-5 h-5" />
                <span>Subscribed</span>
              </>
            )}
          </button>
        </div>
      </div>
      <nav className="flex gap-8 border-b dark:border-gray-700">
        {channelNavigation.map((item, index) => (
          <Link>
            <p
              key={index}
              onClick={() => setIsActive(item?.name)}
              className={`px-4 py-2 ${
                item.name === isActive
                  ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              {item?.name}
            </p>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Channel;
