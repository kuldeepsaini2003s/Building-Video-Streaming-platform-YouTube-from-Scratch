import React, { useEffect, useState } from "react";
import { Dot, X } from "lucide-react";
import axios from "axios";
import {
  BACKEND_USER,
  formatDuration,
  formatViewCount,
  LOCAL_BACKEND_USER,
} from "../utils/constants";
import { Link } from "react-router-dom";

const History = () => {
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const response = await axios.get(LOCAL_BACKEND_USER + "/watchHistory", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          setWatchHistory(response?.data?.data);
        }
      } catch (error) {
        console.error("Error while fetch watch history", error);
        setWatchHistory([]);
      }
    };
    fetchWatchHistory();
  }, []);

  return (
    <div className="px-20 py-5" id="main">
      <h1 className="font-semibold text-2xl">All Subscriptions</h1>
      <div className="mt-5 space-y-5">
        {watchHistory?.length > 0 ? (
          watchHistory.map((item) => (
            <div className="flex gap-3 w-[70]">
              <Link to={`/watch?v=${item?.videoId}`}>
                <div className="flex-shrink-0 rounded-md relative">
                  <img
                    className="w-60 h-36 rounded-md object-cover object-center flex-shrink-0"
                    src={item?.thumbnail}
                    alt="thumbnail"
                  />
                  <p className="absolute text-[0.8rem] font-medium bg-black opacity-80 rounded-md right-2 bottom-2 px-2 py-0.5">
                    {formatDuration(item?.duration)}
                  </p>
                </div>
              </Link>
              <div className="space-y-2 w-full">
                <div>
                  <Link to={`/watch?v=${item?.videoId}`}>
                    <h1 className="line-clamp-2 text-xl font-semibold">
                      {item?.title}
                    </h1>
                  </Link>
                  <div className="flex items-end text-xs text-Lightblack font-medium">
                  <Link to={`/watch?v=${item?.videoId}`}>
                    {item?.channelName}
                    </Link>
                    <Dot width={12} height={12} strokeWidth={2} />
                    {formatViewCount(item?.views)}
                  </div>
                </div>
                <p className="line-clamp-2 text-sm leading-5">
                  {item?.description}
                </p>
              </div>
              <button>
                <X
                  size={40}
                  strokeWidth={1}
                  className="flex-shrink-0 bg-hover_icon_black cursor-pointer p-2 rounded-full"
                />
              </button>
            </div>
          ))
        ) : (
          <p>No watch history</p>
        )}
      </div>
    </div>
  );
};

export default History;
