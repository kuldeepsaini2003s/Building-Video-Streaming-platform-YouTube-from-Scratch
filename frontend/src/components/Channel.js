import React, { useEffect, useState } from "react";
import { FiBell, FiBellOff } from "react-icons/fi";
import { Link, Outlet, useParams } from "react-router-dom";
import { BACKEND_USER, BACKEND_VIDEO } from "../utils/constants";
import { useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";

const channelNavigation = [
  {
    name: "Videos",
    path: "videos",
  },
  {
    name: "Playlists",
    path: "playlists",
  },
  {
    name: "Community",
    path: "community",
  },
  {
    name: "About",
    path: "about",
  },
];

const Channel = () => {
  const { id } = useParams();
  const user = useSelector((store) => store.user.user);
  const [channelDetails, setChannelDetails] = useState({});
  const [videos, setVideos] = useState([]);

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
      try {
        const response = await fetch(BACKEND_VIDEO + `/getUserAllVideo/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          setVideos(data?.data);
        }
      } catch (error) {
        console.error("Error while fetching user videos", error);
      }
    };
    fetchUserVideos();
  }, [id]);

  const [isActive, setIsActive] = useState("Videos");

  return (
    <div id="main">
      {channelDetails?.coverImage && (
        <img
          src={channelDetails?.coverImage}
          className="h-56 w-full object-cover object-center rounded-xl"
          alt=""
        />
      )}
      <div className="flex gap-5 my-5">
        {channelDetails?.avatar ? (
          <div className="flex-shrink-0">
            <img
              src={channelDetails?.avatar}
              className="w-40 h-40 object-cover object-center rounded-full border"
              alt=""
            />
          </div>
        ) : (
          <div className="flex-shrink-0">
            <FaCircleUser className="w-20 h-20" />
          </div>
        )}
        <div className="flex-grow space-y-2">
          <h1 className="text-2xl font-bold ">{channelDetails?.channelName}</h1>
          <div className="font-semibold flex gap-x-2 items-center">
            <h1>{channelDetails?.userName}</h1>
            <p>{channelDetails?.subscribersCount} subscribers</p>
            <p>{videos?.length} videos</p>
          </div>
          <p>{channelDetails?.description}</p>
          <div className="flex gap-x-5 text-sm items-center">
            {id === user.userName && (
              <>
                <Link to={"/customize-channel"}>
                  <button className="flex font-medium items-center gap-2 px-5 py-2 rounded-full hover:bg-lightgray dark:bg-icon_black dark:hover:bg-hover_icon_black">
                    Customize channel
                  </button>
                </Link>
                <Link to={"/create-video"}>
                  <button className="flex font-medium items-center gap-2 px-5 py-2 rounded-full hover:bg-lightgray dark:bg-icon_black dark:hover:bg-hover_icon_black">
                    Add Video
                  </button>
                </Link>
              </>
            )}
            {!id === user.userName && (
              <button className="flex items-center font-medium gap-2 px-5 py-2 bg-lightgray dark:bg-icon_black rounded-full hover:bg-Gray dark:hover:bg-hover_icon_black">
                {!channelDetails?.subscribed ? (
                  <>
                    {" "}
                    <FiBell className="w-4 h-4" />
                    <span>Subscribe</span>{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <FiBellOff className="w-4 h-4" />
                    <span>Subscribed</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <nav className="flex gap-8 border-b dark:border-gray-700">
        {channelNavigation.map((item, index) => (
          <Link to={item?.path}>
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
      <Outlet />
    </div>
  );
};

export default Channel;
