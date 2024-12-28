import React, { useEffect, useState } from "react";
import { FiBell, FiBellOff } from "react-icons/fi";
import { Link, Outlet, useParams } from "react-router-dom";
import { BACKEND_USER } from "../utils/constants";
import { useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import UseFetchAllVideos from "../hooks/useFetchAllVideos";
import Shimmer from "./Shimmer";
import ShimmerCard from "./ShimmerCard";

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
  const { userName } = useParams();
  UseFetchAllVideos(userName && userName);
  const user = useSelector((store) => store.user.user);
  const userVideos = useSelector((store) => store.videos?.allVideos);  
  const [channelDetails, setChannelDetails] = useState({});
  const [userVideosCount, setUserVideosCount] = useState(0);
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    if (userVideos) {
      setUserVideosCount(userVideos.length);
      setShimmer(false);
    }
  }, [userVideos]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          BACKEND_USER + `/getChannelDetails/${userName}`,
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
  }, [userName]);

  const [isActive, setIsActive] = useState("Videos");

  return (
    <>
      {shimmer ? (
        <ShimmerCard />
      ) : (
        <div id="main">
          {channelDetails?.coverImage && (
            <img
              src={channelDetails?.coverImage}
              className="h-56 max-md:h-28 w-full object-cover object-center md:rounded-xl"
              alt=""
            />
          )}
          <div className="flex justify-center gap-5 my-5">
            {channelDetails?.avatar ? (
              <div className="flex-shrink-0">
                <img
                  src={channelDetails?.avatar}
                  className="w-40 h-40 max-sm:w-24 max-sm:h-24 object-cover object-center rounded-full border"
                  alt=""
                />
              </div>
            ) : (
              <div className="flex-shrink-0">
                <FaCircleUser className="sm:w-20 sm:h-20" />
              </div>
            )}
            <div className="flex-grow ms:space-y-1 sm:space-y-2">
              <h1 className="sm:text-2xl font-bold ">
                {channelDetails?.channelName || ""}
              </h1>
              <div className="font-semibold max-ml:text-sm flex flex-wrap gap-x-2 items-center">
                <h1>{channelDetails?.userName}</h1>
                <p>{channelDetails?.subscribersCount} subscribers</p>
                <p>{userVideosCount} videos</p>
              </div>
              <p>{channelDetails?.description}</p>
              <div className="flex gap-x-5 ms:text-xs sm:text-sm items-center">
                {userName === user.userName && (
                  <>
                    <Link to={"/customize-channel"}>
                      <button className="flex font-medium items-center gap-2 px-5 py-2 rounded-full hover:bg-lightgray dark:bg-icon_black dark:hover:bg-hover_icon_black">
                        Customize channel
                      </button>
                    </Link>
                    <Link to={"/create-video"}>
                      <button className="flex max-ml:hidden font-medium items-center gap-2 px-5 py-2 rounded-full hover:bg-lightgray dark:bg-icon_black dark:hover:bg-hover_icon_black">
                        Add Video
                      </button>
                    </Link>
                  </>
                )}
                {!userName === user.userName && (
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
          <nav className="flex overflow-x-scroll remove-scrollbar gap-8 border-b dark:border-gray-700">
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
      )}
    </>
  );
};

export default Channel;
