import React, { useEffect, useState } from "react";
import { FiBell, FiBellOff } from "react-icons/fi";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { BACKEND_USER } from "../utils/constants";
import { useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import UseFetchAllVideos from "../hooks/useFetchAllVideos";
import ShimmerCard from "./ShimmerCard";
import { GoDotFill } from "react-icons/go";

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
  const location = useLocation();
  if (userName) {
    UseFetchAllVideos(userName && userName);
  }
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

  const getCurrentTab = () => {
    const currentPath = location.pathname.split("/").pop();
    const activeTab = channelNavigation.find(
      (item) => item.path === currentPath
    );
    return activeTab ? activeTab.name : "Videos";
  };

  const [isActive, setIsActive] = useState(getCurrentTab());

  useEffect(() => {
    setIsActive(getCurrentTab());
  }, [location]);

  return (
    <>
      {shimmer ? (
        <ShimmerCard />
      ) : (
        <div id="main">
          <div className="border-b dark:border-gray-700 px-20">
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
                    className="w-32 h-32 max-sm:w-24 max-sm:h-24 object-cover object-center rounded-full"
                    alt=""
                  />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <FaCircleUser className="sm:w-20 sm:h-20" />
                </div>
              )}
              <div className="flex flex-col justify-between flex-grow ms:space-y-1 sm:space-y-2">
                <div className="ms:space-y-1 sm:space-y-2">
                  <h1 className="sm:text-2xl font-bold ">
                    {channelDetails?.channelName || ""}
                  </h1>
                  <div className=" font-semibold text-sm flex flex-wrap gap-x-2 items-center">
                    <h1>{channelDetails?.userName}</h1>
                    <p className="dark:text-Lightblack flex items-center gap-1">
                      <GoDotFill className="w-2" />{" "}
                      {channelDetails?.subscribersCount} subscribers
                    </p>
                    <p className="dark:text-Lightblack flex items-center gap-1">
                      <GoDotFill className="w-2" /> {userVideosCount} videos
                    </p>
                  </div>
                  <p className="dark:text-Lightblack">
                    {channelDetails?.description}
                  </p>
                </div>
                <div className="flex self-baseline gap-x-5 ms:text-xs sm:text-sm items-center">
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
            <nav className="flex overflow-x-scroll remove-scrollbar gap-8 ">
              {channelNavigation.map((item, index) => (
                <Link to={item?.path}>
                  <p
                    key={index}
                    onClick={() => setIsActive(item?.name)}
                    className={`px-4 font-medium py-2 ${
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
              <div className="px-20"><Outlet /></div>
        </div>
      )}
    </>
  );
};

export default Channel;
