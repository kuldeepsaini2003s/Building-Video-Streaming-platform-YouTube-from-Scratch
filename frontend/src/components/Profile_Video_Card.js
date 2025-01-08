import React from "react";
import { GoDotFill } from "react-icons/go";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { formatDuration, formatViewCount } from "../utils/constants";
import { FaCircleUser } from "react-icons/fa6";

const Profile_Video_Card = ({ info }) => {
  const { title, duration, thumbnail, viewsCount, channelName, avatar } = info;

  return (
    <div>
      <img
        className={`ml:rounded-md sm:h-[10rem]  ms:h-[12rem] object-cover object-center w-full`}
        alt="Thumbnails"
        src={thumbnail}
      />
      <div className="yt-details py-2 sm:px-0 ms:px-4 ms:py-3 flex gap-x-3">
        {avatar ? (
          <img
            className="rounded-full sm:h-10 sm:w-10 ms:h-8 ms:w-8 object-cover flex-shrink-0 object-center"
            alt="Thumbnails"
            src={avatar}
          />
        ) : (
          <FaCircleUser className="sm:w-12 sm:h-14" />
        )}
        <div className="w-full">
          <div className="flex gap-5 justify-between w-full">
            <p className="line-clamp-2 font-semibold sm:text-base ms:text-sm ">
              {title}
            </p>
            <p className="three-dots-container ">
              <PiDotsThreeVerticalBold size={22} />
            </p>
          </div>
          <p className="text-Lightblack text-sm">{channelName}</p>
          <div className="flex gap-1 items-center text-Lightblack text-sm">
            <p>{formatViewCount(viewsCount)} views</p>
            <GoDotFill size={8} />
            <p>{formatDuration(duration)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile_Video_Card;
