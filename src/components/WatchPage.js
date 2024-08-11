import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import UseSingleVideo from "../hooks/UseSingleVideo";
import { useDispatch, useSelector } from "react-redux";
import { YOUTUBE_API_KEY } from "../utils/constants";
import Image from "../Images/user.avif";
import LiveChats from "./LiveChats";
import { setMessages } from "../utils/ChatSlice";
import UseYoutubeComments from "../hooks/UseYoutubeComments";
import { FaRegBell } from "react-icons/fa6";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuSendHorizonal } from "react-icons/lu";

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
  const [channelLogo, setChannelLogo] = useState("");
  const [youtubecomments, setYoutubeComments] = useState([]);
  const dispatch = useDispatch();

  const formatViewCount = (viewCount) => {
    if (viewCount >= 1e6) {
      return (viewCount / 1e6).toFixed(1) + "M";
    } else if (viewCount >= 1e3) {
      return (viewCount / 1e3).toFixed(1) + "K";
    } else {
      return viewCount.toString();
    }  
  };

  UseSingleVideo({ videoId });
  UseYoutubeComments({ videoId });
  const getSignleVideo = useSelector((store) => store.videos.singlevideo);
  const getYoutubeComments = useSelector(
    (store) => store.videos.youtubecomments
  );

  useEffect(() => {
    if (getYoutubeComments) {
      setYoutubeComments(getYoutubeComments);
    }
    if (getSignleVideo) {
      setVideo(getSignleVideo);
    }
  }, [getSignleVideo]);
  // console.log(getSignleVideo);
  const { snippet, statistics } = video;
  const Id = video?.snippet?.channelId;
  const tags = video?.snippet?.tags;
  const publishedAt = snippet ? snippet.publishedAt : null;

  const getSubscriptions = async () => {
    try {
      const data = await fetch(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&channelId=${Id}&key=${YOUTUBE_API_KEY}`
      );
      const json = await data.json();
      console.log(json);
    } catch (error) {      
      console.error("Error fetching subscribers", error)
    }
  };
  const getChannleLogo = async () => {
    try {
      const data = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${Id}&key=${YOUTUBE_API_KEY}`
      );
      const json = await data.json();
      // console.log(json.items[0].snippet.thumbnails.high.url);
      setChannelLogo(json?.items[0]?.snippet?.thumbnails?.high?.url);
    } catch (error) {
      console.error("Error fetching channel data:", error);
    }
  };
  useEffect(() => {
    if (Id) {
      getChannleLogo();
      getSubscriptions();
    }
  }, [Id]);

  const formattedViewCount = statistics
    ? formatViewCount(statistics.viewCount)
    : "";
  const formattedLikesCount = statistics
    ? formatViewCount(statistics.likeCount)
    : "";
  const formattedCommentsCount = statistics
    ? formatViewCount(statistics.commentCount)
    : "";
  const publishedDate = new Date(publishedAt);
  let relativeTime = formatDistanceToNow(publishedDate, { addSuffix: true });

  if (relativeTime.includes("about")) {
    relativeTime = relativeTime.replace("about ", "");
  }

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
    <div className="sm:mt-20 w-full flex gap-16">
      {/* left  */}
      <div className="sm:ml-20 sm:w-[700px] ms:w-full ">
        {/* video */}
        <div className="">
          <iframe
            width="700"
            height="380"
            className="sm:rounded-xl sm:w-[700px] ms:w-full sm:h-[380px] ms:h-[200px]"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        {/* channel-info */}
        <div className="flex flex-col gap-2  my-2 justify-center">
          {/* Channel titile */}
          <h1 className=" text-xl font-semibold w-[95%] overflow-hidden whitespace-nowrap text-ellipsis">
            {video.snippet?.title}
          </h1>
          <div className="flex sm:flex-row ms:flex-col sm:items-center sm:gap-0 ms:gap-0 sm:justify-between">
            <div className="flex sm:justify-normal ms:justify-between items-center gap-5 sm:p-0 ms:p-2">
              {/* user-profile */}
              <div className="flex gap-5 items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src={channelLogo}
                  alt=""
                />
                <div>
                  <p className="font-medium">{video?.snippet?.channelTitle}</p>
                  <p className="text-xs text-[#656565]">23M subscribers</p>
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
            <div className="flex items-center gap-2  text-sm font-medium sm:justify-normal ms:justify-between sm:p-0 ms:p-2">
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
                  <p>{formattedLikesCount}</p>                  
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

          <div className="user-info gap-2 flex flex-col mt-2 sm:m-0 ms:m-2 text-sm bg-lightgray dark:bg-icon_black rounded-2xl p-3">
            {/* views */}
            <div className="flex items-center gap-x-2 font-semibold flex-wrap ">
              <p className="p-0 m-0">{formattedViewCount} views</p>
              <p className="p-0 m-0">{relativeTime} </p>
              <div className={`${showFullDescription ? "" : "line-clamp-1 "}`}>
                {tags &&
                  tags.length > 0 &&
                  tags.map((tag, index) => (
                    <span key={index} className="text-[#656565] p-0 m-0 white">
                      #{tag}
                    </span>
                  ))}
              </div>
            </div>
            {/* description */}
            <div className={`${showFullDescription ? "" : "line-clamp-1"}`}>
              <p>{video?.snippet?.description}</p>
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
          <div>
            <h1>{formattedCommentsCount} Comments</h1>
            <div>
              {youtubecomments.map((items, index) => (
                <div key={index} className="flex gap-4 items-start my-3">
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
        </div>
      </div>
      {/* right */}
      <div className="border sm:flex flex-col justify-between w-[30%] h-fit rounded-lg ms:hidden ">
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
          <LuSendHorizonal className="text-[1.3rem]" />
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
