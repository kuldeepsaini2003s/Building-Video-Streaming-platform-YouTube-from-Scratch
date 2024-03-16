import React from "react";
import { useTheme } from "../utils/ThemeContext";

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
  const { theme, toggleTheme } = useTheme();

  const { snippet, statistics } = info;
  const { channelTitle, localized, thumbnails } = snippet;
  const { title } = localized;
  const titleStyle = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitLineClamp: 2,
  };

  const formattedViewCount = formatViewCount(statistics.viewCount);
  return (
    <div
      className={`bg-${theme === "dark" ? "black" : "white"} text-${
        theme === "dark" ? "white" : "black"
      } h-[60vh] p-2
      lg:w-[30vw]
      sm:w-[43vw]`}
    >
      <img
        className="rounded-xl  h-[75%] w-[100%]"
        alt="Thumbnails"
        src={thumbnails.standard.url}
      />
      <div className="py-2 flex gap-x-3">
        <img
          className="user-img rounded-full h-10 w-10 "
          alt="Thumbnails"
          src={thumbnails.medium.url}
        />
        <div>
          <p
            className={`text-${
              theme === "dark" ? "white" : "black"
            }font-semibold text-base`}
            style={titleStyle}
          >
            {title}
          </p>
          <p className={`text-Lightblack text-sm`}>{channelTitle}</p>
          <p className={`text-Lightblack text-sm`}>
            {formattedViewCount} views
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
