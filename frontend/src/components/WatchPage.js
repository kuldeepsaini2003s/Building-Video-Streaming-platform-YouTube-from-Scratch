import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import UseSingleVideo from "../hooks/UseSingleVideo";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../utils/ChatSlice";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import {
  BACKEND_PLAYLIST,
  BACKEND_SUBSCRIPTION,
  BACKEND_VIDEO,
  formatDuration,  
} from "../utils/constants";
import axios from "axios";
import UseLikeHandler from "../hooks/UseLikeHandler";
import Lottie from "lottie-react";
import bell_icon_white from "../Icons/Bell-icon-white.json";
import { CreatePlaylist, SavePlaylist } from "./Playlist";
import { Bookmark, X } from "lucide-react";
import { MdBookmarkAdded } from "react-icons/md";

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
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const videoId = searchParams.get("v");
  const playlistId = searchParams.get("list");
  const userToken = localStorage.getItem("token");
  const [video, setVideo] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();
  const [shimmer, setShimmer] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showLoginPop, setShowLoginPop] = useState(false);

  const { liked, disliked, likesCount, likeHandler, dislikeHandler } =
    UseLikeHandler(videoId);
  UseSingleVideo(videoId);

  const currentUser = useSelector((store) => store.user.user);
  const getVideo = useSelector((store) => store.videos.singleVideo);

  useEffect(() => {
    if (getVideo) {
      const { subscribersCount, subscribed } = getVideo;
      setVideo(getVideo);
      setSubscribersCount(subscribersCount);
      setSubscribed(subscribed);
      setShimmer(false);
    }
  }, [getVideo]);

  const {
    channelName,
    description,
    duration,
    tags,
    title,
    userAvatar,
    userName,
    videoUrl,
    videoViewed,
    viewsCount,
    videoSaved,
    user,
    createdAt,
  } = video;

  useEffect(() => {
    const fetchPlaylist = async () => {
      const { data } = await axios.get(
        BACKEND_PLAYLIST + `/playlist/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data) {
        setPlaylist(data?.data);
      }
    };
    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId]);

  useEffect(() => {
    const addVideoToWatched = async () => {
      try {
        await axios.get(BACKEND_VIDEO + `/add_To_Watched/${videoId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
      } catch (error) {
        console.error("Error while adding video to watched history", error);
      }
    };
    if (videoId) {
      addVideoToWatched();
    }
  }, [videoId]);

  useEffect(() => {
    const updateViews = async () => {
      try {
        await axios.get(BACKEND_VIDEO + `/updateViews/${videoId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
      } catch (error) {
        console.error("Error while updating views", error);
      }
    };
    if (!videoViewed) {
      const timeout = setTimeout(() => {
        updateViews();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [videoViewed, videoId]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const subscriberHandler = async () => {
    if (!currentUser) {
      setShowLoginPop(true);
      return;
    }
    if (!subscribed) {
      try {
        await axios.get(BACKEND_SUBSCRIPTION + `/subscribe/${channelName}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
      } catch (error) {
        console.error("Error while subscribing channel", error);
      }
      setSubscribed(true);
    } else {
      setShowPop(true);
    }
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

  const handleConfirmation = async () => {
    try {
      await axios.get(BACKEND_SUBSCRIPTION + `/unsubscribe/${channelName}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
    } catch (error) {
      console.error("Error while subscribing channel", error);
    }
    setSubscribed(false);
  };

  const ConfirmationPop = () => {
    return (
      <div
        onClick={() => setShowPop(false)}
        className="absolute w-dvw h-dvh top-0 left-0 remove-scrollbar bg-black bg-opacity-30 flex justify-center items-center"
      >
        <div className="text-Lightblack bg-[#212121] flex flex-col justify-between items-center h-36 rounded-md p-5">
          <p>Unsubscribe from {channelName}</p>
          <div className="flex gap-4 items-center justify-end">
            <button
              onClick={() => setShowPop(false)}
              className="px-4 py-1 rounded-full font-medium dark:hover:bg-hover_icon_black dark:text-white hover:bg-lightgray"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmation}
              className="px-4 py-1 rounded-full font-medium text-[#388BD4] hover:bg-[#3ca4ff36]"
            >
              Unsubscribe
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LoginPop = () => {
    return (
      <div
        onClick={() => setShowLoginPop(false)}
        className="absolute w-dvw h-dvh top-0 left-0 remove-scrollbar bg-black bg-opacity-30 flex justify-center items-center"
      >
        <div className="text-Lightblack bg-[#212121] flex flex-col justify-between items-center h-36 rounded-md p-5">
          <p>Unsubscribe from {channelName}</p>
          <div className="flex gap-4 items-center justify-end">
            <button
              onClick={() => setShowPop(false)}
              className="px-4 py-1 rounded-full font-medium dark:hover:bg-hover_icon_black dark:text-white hover:bg-lightgray"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmation}
              className="px-4 py-1 rounded-full font-medium text-[#388BD4] hover:bg-[#3ca4ff36]"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleLoginPop = () => {
    setShowLoginPop(!showLoginPop);
  };

  return (
    <>
      {shimmer ? (
        <p>Loading....</p>
      ) : (
        <div id="main" className="sm:px-24 py-5 flex max-sm::flex-col gap-5">
          {/* left  */}
          <div className="ms:w-[80%]">
            {/* video */}
            <video
              className="sm:rounded-xl -z-40 w-full sm:h-[420px] object-contain aspect-video"
              src={videoUrl}
              controls
              autoPlay
            ></video>
            {/* channel-info */}
            <div className="max-sm:mx-3 flex flex-col gap-2 my-2 justify-center">
              {/* Channel titile */}
              <h1 className=" text-xl font-semibold w-[95%] overflow-hidden whitespace-nowrap text-ellipsis">
                {title}
              </h1>
              <div className="flex max-sm:flex-col sm:items-center sm:justify-between">
                <div className="flex max-sm:justify-between items-center max-sm:gap-3 gap-5 max-sm:p-2">
                  {/* user-profile */}
                  <Link to={`/${userName}`}>
                    <div className="flex gap-5 items-center">
                      <img
                        className="h-12 w-12 rounded-full object-contain aspect-square object-center"
                        src={userAvatar}
                        alt=""
                      />
                      <div>
                        <p className="font-medium">{channelName}</p>
                        <p className="text-xs text-Lightblack font-medium">
                          {subscribersCount} subscribers
                        </p>
                      </div>
                    </div>
                  </Link>
                  {/* subscribe-btn */}
                  {currentUser?._id !== user ? (
                    <button
                      onClick={subscriberHandler}
                      className="watch-btn subscriber px-3 py-2 dark:bg-icon_black dark:hover:bg-hover_icon_black flex gap-1 items-center text-sm cursor-pointer rounded-3xl"
                    >
                      {subscribed && (
                        <Lottie
                          animationData={bell_icon_white}
                          play={isPlaying}
                          loop={false}
                          className="w-6"
                        />
                      )}
                      {!subscribed ? "Subscribe" : "Subscribed"}
                    </button>
                  ) : (
                    <Link to={`/${userName}`}>
                      <button className="watch-btn subscriber px-3 py-2 dark:bg-icon_black dark:hover:bg-hover_icon_black flex gap-1 items-center text-sm cursor-pointer rounded-3xl">
                        View Channel
                      </button>
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2  text-sm font-medium max-sm:p-2">
                  {/* like-btn */}
                  <div className="user-info flex items-center bg-lightgray dark:bg-icon_black rounded-full ">
                    <div
                      onClick={() => {
                        if (!currentUser) {
                          setShowLoginPop(true);
                          return;
                        }
                        likeHandler();
                      }}
                      className="watch-btn flex gap-1 items-center px-4 py-2 select-none dark:hover:bg-hover_icon_black  cursor-pointer"
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
                      onClick={() => {
                        if (!currentUser) {
                          setShowLoginPop(true);
                          return;
                        }
                        dislikeHandler();
                      }}
                      className="cursor-pointer px-4 rounded-full rounded-l-none py-2 dark:hover:bg-hover_icon_black "
                    >
                      {!disliked ? (
                        <BiDislike className="text-[1.3rem]" />
                      ) : (
                        <BiSolidDislike className="text-[1.3rem]" />
                      )}
                    </div>
                  </div>
                  {/* share-btn */}
                  <div
                    className="watch-btn user-info flex items-center gap-1 bg-lightgray dark:bg-icon_black dark:hover:bg-hover_icon_black rounded-3xl px-4 py-2 cursor-pointer "
                    onClick={handleShare}
                  >
                    <RiShareForwardLine className="text-[1.3rem]" />
                    <p>Share</p>
                  </div>
                  {/* option-btn */}
                  {videoSaved ? (
                    <button className="watch-btn user-info flex items-center gap-2 bg-lightgray dark:bg-icon_black dark:hover:bg-hover_icon_black rounded-3xl px-4 py-2 cursor-pointer ">
                      <MdBookmarkAdded size={21} /> Saved
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPlaylist(true)}
                      className="watch-btn user-info flex items-center gap-2 bg-lightgray dark:bg-icon_black dark:hover:bg-hover_icon_black rounded-3xl px-4 py-2 cursor-pointer "
                    >
                      <Bookmark strokeWidth={2} size={21} /> Save
                    </button>
                  )}
                </div>
              </div>

              <div className="gap-2 flex flex-col mt-2 sm:m-0 text-sm bg-lightgray dark:bg-icon_black rounded-2xl p-3">
                {/* views */}
                <div className="flex items-center gap-x-2 font-semibold flex-wrap ">
                  <p className="p-0 m-0">{formatViewCount(viewsCount)} views</p>
                  <p className="p-0 m-0">{formatDuration(duration)} </p>
                  <div
                    className={`${showFullDescription ? "" : "line-clamp-1 "}`}
                  >
                    {tags?.length > 0 &&
                      tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="text-Lightblack p-0 m-0 white"
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
          {playlistId && (
            <div className="border sm:flex flex-col dark:bg-icon_black justify-between min-w-[35%] hidden h-fit rounded-lg">
              <div className="flex justify-between items-center border-b p-2">
                <div>
                  <p className="font-bold text-lg">{playlist[0]?.title}</p>
                  <p className="text-xs text-Lightblack">
                    <span className="text-white font-medium">
                      {playlist[0]?.channelName}
                    </span>{" "}
                    - {playlist?.length}
                  </p>
                </div>
                <X
                  size={40}
                  strokeWidth={1}
                  className="p-2 rounded-full dark:bg-icon_black dark:hover:bg-hover_icon_black"
                />
              </div>
              <div className="no-scrollbar dark:bg-black rounded-b-xl flex flex-col-reverse overflow-y-auto px-4 py-2 max-h-[19rem]">
                <div className="flex flex-col gap-2">
                  {playlist &&
                    playlist?.map((item, index) => (
                      <Link
                        to={`/watch?v=${item.video_id}&list=${item._id}&index=${
                          index + 1
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-Lightblack">{index + 1}</p>
                          <div className="relative">
                            <img
                              className="w-24 h-14 rounded-md object-contain aspect-video object-center"
                              src={item?.thumbnail}
                              alt=""
                            />
                            <p className="absolute right-1 bottom-1 rounded-sm text-xs px-1 bg-black bg-opacity-80 ">
                              {formatDuration(item?.duration)}
                            </p>
                          </div>
                          <div className="flex flex-col justify-between text-sm">
                            <h1 className="line-clamp-2">
                              {item?.video_title}
                            </h1>
                            <h1 className="text-Lightblack text-xs">
                              {item?.channelName}
                            </h1>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          )}

          {showLoginPop && <LoginPop />}
          {showPop && <ConfirmationPop />}
          {showCreatePlaylist && (
            <CreatePlaylist
              setShowCreatePlaylist={setShowCreatePlaylist}
              setShowPlaylist={setShowPlaylist}
            />
          )}
          {showPlaylist && (
            <SavePlaylist
              setShowPlaylist={setShowPlaylist}
              setShowCreatePlaylist={setShowCreatePlaylist}
              videoId={video._id}
            />
          )}
        </div>
      )}
    </>
  );
};

export default WatchPage;
