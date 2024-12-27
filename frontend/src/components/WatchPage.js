import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UseSingleVideo from "../hooks/UseSingleVideo";
import { useDispatch, useSelector } from "react-redux";
import Image from "../Images/user.avif";
import LiveChats from "./LiveChats";
import { setMessages } from "../utils/ChatSlice";
import UseYoutubeComments from "../hooks/UseYoutubeComments";
import { FaRegBell } from "react-icons/fa6";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuSendHorizontal } from "react-icons/lu";

const formatViewCount = (viewCount) => {
  if (viewCount >= 1e6) {
    return (viewCount / 1e6).toFixed(1) + "M";
  } else if (viewCount >= 1e3) {
    return Math.round(viewCount / 1e3) + "K";
  } else {
    return viewCount.toString();
  }
};

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const videoId = searchParams.get("v");
  const [video, setVideo] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [youtubecomments, setYoutubeComments] = useState([]);
  const dispatch = useDispatch();
  const [shimmer, setShimmer] = useState(true);

  UseSingleVideo({ videoId });
  UseYoutubeComments({ videoId });
  const getVideo = useSelector((store) => store.videos.singleVideo);

  const getYoutubeComments = useSelector(
    (store) => store.videos.youtubecomments
  );

  useEffect(() => {
    if (getYoutubeComments) {
      setYoutubeComments(getYoutubeComments);
    }
    if (getVideo) {
      setVideo(getVideo);
      setShimmer(false);
    }
  }, [getVideo]);

  const {
    channelName,
    description,
    duration,
    likesCount,
    subscribersCount,
    tags,
    title,
    userAvatar,
    videoUrl,
    views,
  } = video;

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const subscriberHandler = () => {
    setSubscribed(!subscribed);
  };
  const likeHandler = () => {
    setLiked(!liked);
    setDisliked(true);
  };

  const dislikeHandler = () => {
    setDisliked(!disliked);
    setLiked(false);
  };
  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    alert("URL copied to clipboard!");
  };

  const sendMessage = () => {
    if (!inputValue) {
      return;
    }
    dispatch(
      setMessages({
        name: "Oscar",
        message: inputValue,
      })
    );
    setInputValue("");
  };

  return (
    <>
      {shimmer ? (
        <p>Loading....</p>
      ) : (
        <div id="main" className="p-5 flex gap-10">
          {/* left  */}
          <div className="xl:ml-10 max-xl:mx-2 ms:w-full ">
            {/* video */}
            <video
              className="sm:rounded-xl w-full sm:h-[380px]"
              src={videoUrl}
              controls="true"
            ></video>
            {/* channel-info */}
            <div className="flex flex-col gap-2 my-2 justify-center">
              {/* Channel titile */}
              <h1 className=" text-xl font-semibold w-[95%] overflow-hidden whitespace-nowrap text-ellipsis">
                {title}
              </h1>
              <div className="flex max-sm:flex-col sm:items-center sm:justify-between">
                <div className="flex max-sm:justify-between items-center max-sm:gap-3 gap-5 max-sm:p-2">
                  {/* user-profile */}
                  <div className="flex gap-5 items-center">
                    <img
                      className="h-12 w-12 rounded-full object-cover object-center"
                      src={userAvatar}
                      alt=""
                    />
                    <div>
                      <p className="font-medium">{channelName}</p>
                      <p className="text-xs text-[#656565]">
                        {subscribersCount} subscribers
                      </p>
                    </div>
                  </div>
                  {/* subscribe-btn */}
                  <button
                    onClick={subscriberHandler}
                    className="watch-btn subscriber px-3 py-2 dark:bg-icon_black dark:hover:bg-hover_icon_black flex items-center text-sm cursor-pointer rounded-3xl"
                  >
                    {subscribed && <FaRegBell className="text-[1rem] mr-1" />}
                    {!subscribed ? "Subscribe" : "Subscribed"}
                  </button>
                </div>
                <div className="flex items-center gap-2  text-sm font-medium max-sm:p-2">
                  {/* like-btn */}
                  <div className="user-info flex items-center bg-lightgray dark:bg-icon_black rounded-full ">
                    <div
                      onClick={likeHandler}
                      className="watch-btn flex gap-1 items-center px-3 py-2 select-none dark:hover:bg-hover_icon_black  cursor-pointer"
                      style={{
                        borderTopLeftRadius: "20px",
                        borderBottomLeftRadius: "20px",
                      }}
                    >
                      {!liked ? (
                        <BiLike className="text-[1.3rem]" />
                      ) : (
                        <BiSolidLike className="text-[1.3rem]" />
                      )}
                      <p>{likesCount}</p>
                    </div>
                    <span className="border-l-2 py-3"></span>
                    <div
                      onClick={dislikeHandler}
                      className="cursor-pointer px-4 rounded-full rounded-l-none py-2 dark:hover:bg-hover_icon_black "
                    >
                      {disliked ? (
                        <BiDislike className="text-[1.3rem]" />
                      ) : (
                        <BiSolidDislike className="text-[1.3rem]" />
                      )}
                    </div>
                  </div>
                  {/* share-btn */}
                  <div
                    className="watch-btn user-info flex items-center gap-1 bg-lightgray dark:bg-icon_black dark:hover:bg-hover_icon_black rounded-3xl px-3 py-2 cursor-pointer "
                    onClick={handleShare}
                  >
                    <RiShareForwardLine className="text-[1.3rem]" />
                    <p>Share</p>
                  </div>
                  {/* option-btn */}
                  <div className="watch-btn bg-lightgray dark:bg-icon_black dark:hover:bg-hover_icon_black rounded-3xl p-2 cursor-pointer ">
                    <HiOutlineDotsHorizontal className="text-[1.3rem]" />
                  </div>
                </div>
              </div>

              <div className="gap-2 flex flex-col mt-2 sm:m-0 text-sm bg-lightgray dark:bg-icon_black rounded-2xl p-3">
                {/* views */}
                <div className="flex items-center gap-x-2 font-semibold flex-wrap ">
                  <p className="p-0 m-0">{formatViewCount(views)} views</p>
                  <p className="p-0 m-0">{duration} </p>
                  <div
                    className={`${showFullDescription ? "" : "line-clamp-1 "}`}
                  >
                    {tags &&
                      tags.length > 0 &&
                      tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-[#656565] p-0 m-0 white"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
                {/* description */}
                <div className={`${showFullDescription ? "" : "line-clamp-1"}`}>
                  <p>{description}</p>
                </div>
                {!showFullDescription ? (
                  <p
                    onClick={toggleDescription}
                    className="cursor-pointer text-blue-500"
                  >
                    ...more
                  </p>
                ) : (
                  <p
                    onClick={toggleDescription}
                    className="cursor-pointer text-blue-500"
                  >
                    ...Show less
                  </p>
                )}
              </div>
              {/* comments-container */}
              {/* <div className="w-[100vw]">
            <h1>{formattedCommentsCount} Comments</h1>
            <div>
              {youtubecomments.map((items, index) => (
                <div
                  key={index}
                  className="flex gap-4 text-wrap items-start my-3"
                >
                  <img
                    className="rounded-full w-10"
                    src={
                      items?.snippet?.topLevelComment?.snippet
                        ?.authorProfileImageUrl
                    }
                    alt=""
                  />
                  <div>
                    <h1 className="text-xs mb-1 font-medium">
                      {
                        items?.snippet?.topLevelComment?.snippet
                          ?.authorDisplayName
                      }
                    </h1>
                    <p className="text-sm">
                      {items?.snippet?.topLevelComment?.snippet?.textOriginal}
                    </p>
                    <div className="flex items-center mt-2 gap-5">
                      <div className="flex items-center gap-2">
                        <BiLike className="text-[1.3rem]" />
                        {items?.snippet?.topLevelComment?.snippet?.likeCount}
                      </div>
                      <BiDislike className="text-[1.3rem]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
            </div>
          </div>
          {/* right */}
          <div className="border sm:flex flex-col justify-between min-w-[30%] hidden h-fit rounded-lg">
            <div className="flex justify-between items-center border-b p-4">
              <p>Top Chats</p>
              <BsThreeDotsVertical className="text-[2.2rem] p-2 rounded-full dark:bg-icon_black dark:hover:bg-hover_icon_black" />
            </div>
            <div className="no-scrollbar flex flex-col-reverse overflow-y-auto px-4 py-2 h-[22rem]">
              <LiveChats />
            </div>
            <div className="w-full px-4 py-2  border-t flex justify-center items-center gap-3">
              {/* user image */}
              <img className="h-10 rounded-full" src={Image} alt="" />
              <input
                className="w-[90%] text-sm bg-transparent outline-none bg-lightblack px-4 py-2 rounded-full"
                type="text"
                placeholder="Chat..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              {/* Send button */}
              <LuSendHorizontal className="text-[1.3rem]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WatchPage;
