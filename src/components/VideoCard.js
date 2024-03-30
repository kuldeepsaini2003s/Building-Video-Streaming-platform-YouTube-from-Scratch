import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { GOOGLE_API_KEY } from "../utils/constants";

const formatViewCount = (viewCount) => {
  if (viewCount >= 1e6) {
    return (viewCount / 1e6).toFixed(1) + "M";
  } else if (viewCount >= 1e3) {
    return (viewCount / 1e3).toFixed(1) + "K";
  } else {
    return viewCount.toString();
  }
};

const VideoCard = ({ info }) => {
  const [channelLogo, setChannelLogo] = useState([]);
  const { snippet, statistics } = info;
  const { channelTitle, publishedAt, channelId, localized, thumbnails } =
    snippet;
  const { title } = localized;
  const titleStyle = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitLineClamp: 2,
  };
  const { medium, maxres } = thumbnails;
  const thumbnail = maxres || medium;
  const formattedViewCount = formatViewCount(statistics.viewCount);
  const publishedDate = new Date(publishedAt);
  let relativeTime = formatDistanceToNow(publishedDate, { addSuffix: true });

  if (relativeTime.includes("about")) {
    relativeTime = relativeTime.replace("about ", "");
  }

  const getChannelLogos = async () => {
    const data = await fetch(
      `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${GOOGLE_API_KEY}`
    );
    const json = await data.json();
    setChannelLogo(json.items[0].snippet.thumbnails.high.url);
  };

  useEffect(() => {
    getChannelLogos();
  }, []);

  return (
    <div className="sm:h-[60vh] ms:h-fit p-2 lg:w-[30vw] sm:w-[43vw] ms:w-full  sm:text-base ms:text-sm">
      <img
        className="rounded-xl sm:h-[13rem] ms:h-[13rem] sm:w-[98%] ms:w-full"
        alt="Thumbnails"
        src={thumbnail.url}
      />
      <div className="yt-details pt-4 py-2 flex gap-x-3">
        <img
          className="user-img rounded-full sm:h-10 sm:w-10 ms:h-8 ms:w-8"
          alt="Thumbnails"
          src={channelLogo}
        />
        <div className="w-full">
          <div className="flex gap-5 justify-between w-full">
            <p
              className="font-semibold sm:text-base ms:text-sm "
              style={titleStyle}
            >
              {title}
            </p>
            <p className="three-dots-container ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
              </svg>
            </p>
          </div>
          <div className="ms:flex gap-2">
            <p className="text-Lightblack text-sm">{channelTitle}</p>
            <p className="flex items-center ">
              <span className="text-Lightblack text-sm">
                {formattedViewCount} views
              </span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="16"
                  fill="#5a5a5a"
                  className="bi bi-dot "
                  viewBox="0 0 16 16"
                >
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                </svg>
              </span>
              <span className="text-Lightblack text-sm">{relativeTime}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
