import React, { useEffect, useState } from "react";
import thumbnail from "../Images/fornt-1.png";
import { X } from "lucide-react";
import axios from "axios";
import { BACKEND_USER } from "../utils/constants";

const History = () => {
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      await axios.get(BACKEND_USER + "/watchHistory");
    };
    fetchWatchHistory();
  }, []);

  return (
    <div className="px-20 py-5" id="main">
      <h1 className="font-semibold text-2xl">All Subscriptions</h1>
      <div className="mt-5">
        <div className="flex gap-3 w-[70%]">
          <img
            className="w-60 h-36 rounded-md object-cover object-center flex-shrink-0"
            src={thumbnail}
            alt="thumbnail"
          />
          <div className="space-y-2 w-full">
            <div>
              <h1 className="line-clamp-2 text-xl font-semibold">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
                ipsa officia exercitationem aliquam quos molestiae cupiditate
                fugit saepe doloremque ullam animi veritatis, enim quasi et
                distinctio! Voluptates, fugiat? Nulla, consectetur.
              </h1>
              <h1 className="text-xs text-Lightblack font-medium mt-1">
                Channel name of the user
              </h1>
            </div>
            <p className="line-clamp-2 text-sm leading-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
              totam corporis amet vitae non rerum fuga quos dolorum possimus.
              Error dicta vitae magnam rem recusandae illum quas sit neque id!
            </p>
          </div>
          <X
            size={40}
            strokeWidth={1}
            className="flex-shrink-0 bg-hover_icon_black cursor-pointer p-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default History;
