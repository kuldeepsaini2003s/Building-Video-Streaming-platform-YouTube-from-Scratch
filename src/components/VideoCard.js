import React from "react";
import { formatDistanceToNow } from "date-fns";
import ShimmerCard from "./ShimmerCard";

const formatViewCount = (viewCount) => {
  if (viewCount >= 1e6) {
    return (viewCount / 1e6).toFixed(1) + "m";
  } else if (viewCount >= 1e3) {
    return (viewCount / 1e3).toFixed(1) + "k";
  } else {
    return viewCount.toString();
  }
};

const VideoCard = ({ info }) => {
  if(!info || !info.snippet || !info.statistics) {
    console.log("rendering shimmer effect")
    return <ShimmerCard/>;
  }
  const { snippet, statistics } = info;
  const { channelTitle, publishedAt, localized, thumbnails } = snippet;
  const { title } = localized;
  const titleStyle = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitLineClamp: 2,
  };

  const {medium, maxres} = thumbnails;
  const thumbnail = maxres || medium ;

  const formattedViewCount = formatViewCount(statistics.viewCount);
  const publishedDate = new Date(publishedAt);
  let relativeTime = formatDistanceToNow(publishedDate, { addSuffix: true });

  if (relativeTime.includes("about")) {
    relativeTime = relativeTime.replace("about ", "");
  }

  return (
    <div className="h-[60vh] p-2 lg:w-[30vw] sm:w-[43vw]">
         <img
        className="rounded-xl h-[65%] w-[100%]"
        alt="Thumbnails"
        src={thumbnail.url}
      />
      <div className="yt-details pt-4 py-2 flex gap-x-3">
        <img
          className="user-img rounded-full h-10 w-10"
          alt="Thumbnails"
          src={thumbnails.medium.url}
        />
        <div className="w-full">
          <div className="flex gap-5 justify-between w-full">
            <p className="font-semibold text-base" style={titleStyle}>
              {title}
            </p>
            <p className="three-dots-container ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                class="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
              </svg>
            </p>
          </div>
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
                class="bi bi-dot "
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
  );
};

export default VideoCard;
