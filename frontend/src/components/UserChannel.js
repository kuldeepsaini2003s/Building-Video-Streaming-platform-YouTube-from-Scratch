import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToast } from "react-toastify";
import { LOCAL_BACKEND_USER } from "../utils/constants";
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoDotFill } from "react-icons/go";
import { FaCircleUser } from "react-icons/fa6";
import VideoCard from "./VideoCard";

const UserChannel = () => {
  const userToken = localStorage.getItem("token");
  const user = useSelector((store) => store?.user?.user);
  const [userVideosCount, setUserVideosCount] = useState(0);
  const [history, setHistory] = useState([]);

//   useEffect(() => {
//     const fetchWatchHistory = async () => {
//       try {
//         const response = await axios.get(LOCAL_BACKEND_USER + "/watchHistory", {
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//           },
//         });
//         if (response.status === 200) {
//           setHistory(response?.data?.data);
//         }
//       } catch (error) {
//         console.error("Error while fetching user details");
//         setHistory([]);
//       }
//     };
//     if (userToken) {
//       fetchWatchHistory();
//     }
//   }, [userToken]);

  return (
    <div id="main" className="px-20 py-2">
      {user ? (
        <>
          <Link to={`/${user?.userName}`}>
            <div className="flex justify-center gap-5 my-5">
              {user?.avatar ? (
                <div className="flex-shrink-0">
                  <img
                    src={user?.avatar}
                    className="w-32 h-32 max-sm:w-24 max-sm:h-24 object-contain aspect-square object-center rounded-full"
                    alt=""
                  />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <FaCircleUser className="sm:w-16 sm:h-20" />
                </div>
              )}
              <div className="flex flex-col flex-grow ms:space-y-1 sm:space-y-4">
                <div className="ms:space-y-1 sm:space-y-2">
                  <h1 className="sm:text-2xl font-bold ">
                    {user?.channelName || ""}
                  </h1>
                  <div className=" font-semibold text-sm flex flex-wrap gap-x-2 items-center">
                    <h1>{user?.userName}</h1>
                    <p className="dark:text-Lightblack flex items-center gap-1">
                      <GoDotFill className="w-2" /> {user?.subscribersCount}{" "}
                      View channel
                    </p>
                  </div>
                </div>
                <div className="flex self-baseline gap-x-5 ms:text-xs sm:text-sm items-center">
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
                </div>
              </div>
            </div>
          </Link>
          <div>
            <h1 className="font-semibold text-lg mt-4">History</h1>
            {history?.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {history?.map((item) => (
                  <VideoCard info={item} />
                ))}
              </div>
            ) : (
              <p className="text-sm">
                Videos that you watch will be shown here.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center pt-36">
          <p>Sign in to access videos that you’ve liked or saved</p>
          <Link to={"/login"}>
            <button className="flex gap-2 items-center border mt-5 border-icon_black font-medium rounded-full text-sm px-3 py-1">
              <CircleUserRound size={25} strokeWidth={1} /> Sign in
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserChannel;
