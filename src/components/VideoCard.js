import React from "react";

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
    <div className=" mx-1 p-1 mb-2  w-[30vw]">
      <img
        className="rounded-lg h-[45vh] w-[30vw]"
        alt="Thumbnails"
        src={thumbnails.high.url}
      />
      <div className="py-2 flex gap-x-3">
      <img
        className="user-img rounded-full h-10 w-10 "
        alt="Thumbnails"
        src={thumbnails.high.url}
      />
      <div>
      <p className="font-semibold text-base" style={titleStyle}>{title}</p>
        <p className="text-lightblack text-sm">{channelTitle}</p>
        <p className="text-lightblack text-sm">{formattedViewCount} views</p>
      </div>
      </div>
    </div>
  );
};

export default VideoCard;
