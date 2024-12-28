import React from "react";

const formatViewCount = (viewCount) => {
  if (viewCount >= 1e6) {
    return (viewCount / 1e6).toFixed(1) + "M";
  } else if (viewCount >= 1e3) {
    return (viewCount / 1e3).toFixed(1) + "K";
  } else {
    return viewCount.toString();
  }
};

const formatDuration = (duration) => {
  const totalSeconds = Math.round(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const VideoCard = ({ info }) => {
  const { title, duration, thumbnail, views, channelName, avatar } = info;

  return (
    <div>
      <img
        className="ml:rounded-md sm:h-[12rem]  ms:h-[12rem] object-cover object-center w-full"
        alt="Thumbnails"
        src={thumbnail}
      />
      <div className="yt-details sm:pt-4 py-2 sm:px-0 ms:px-4 ms:py-3 flex gap-x-3">
        <img
          className="rounded-full sm:h-10 sm:w-10 ms:h-8 ms:w-8 object-cover flex-shrink-0 object-center"
          alt="Thumbnails"
          src={avatar}
        />
        <div className="w-full">
          <div className="flex gap-5 justify-between w-full">
            <p className="line-clamp-2 font-semibold sm:text-base ms:text-sm ">
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
            <p className="text-Lightblack text-sm">{channelName}</p>
            <p className="flex items-center ">
              <span className="text-Lightblack text-sm">
                {formatViewCount(views)} views
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
              <span className="text-Lightblack text-sm">
                {formatDuration(duration)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
