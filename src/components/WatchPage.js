import React, { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import { GOOGLE_API_KEY } from "../utils/constants";
import { formatDistanceToNow } from "date-fns";

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
  console.log(searchParams);
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const videoId = searchParams.get("v");
  const [video, setVideo] = useState([]);

  const getVideo = async () => {
    try {
      const data = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&maxResults=50&regionCode=IN&key=${GOOGLE_API_KEY}`
      );
      const json = await data.json();
      console.log(json.items[0]);
      setVideo(json.items[0]);
    } catch (error) {}
  };
  useEffect(() => {
    getVideo();
  }, []);

  const { snippet, statistics } = video;
  const publishedAt = snippet ? snippet.publishedAt : null;

  const formattedViewCount = statistics
    ? formatViewCount(statistics.viewCount)
    : "";
  const formattedLikesCount = statistics
    ? formatViewCount(statistics.likeCount)
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
  return (
    <div className="mt-16 ml-20 w-[700px] ">
      {/* video */}
      <div className="">
        <iframe
          width="700"
          height="390"
          className="rounded-xl"
          src={`https://www.youtube.com/embed/${videoId}?&autoplay=1`}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      {/* channel-info */}
      <div className="flex flex-col gap-2  my-2 justify-center">
        {/* Channel titile */}
        <h1 className=" text-lg w-[95%] overflow-hidden whitespace-nowrap text-ellipsis">
          {video.snippet?.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* user-profile */}
            <div className="flex gap-5 items-center">
              <img
                className="h-12 w-12 rounded-full"
                src={require("../Images/thumbnail-1.jpeg")}
                alt=""
              />
              <div>
                <p>{video?.snippet?.channelTitle}</p>
                <p className="text-xs text-[#656565]">23M subscribers</p>
              </div>
            </div>
            {/* subscribe-btn */}
            <button
              onClick={subscriberHandler}
              className={`bg-${subscribed ? "lightgray" : "black"} text-${
                subscribed ? "black" : "white"
              } px-3 py-2 flex items-center text-sm cursor-pointer rounded-3xl`}
            >
              {subscribed && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-bell"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#000000 "
                  fill="none"
                  stroke-linecap="round"
                  className="h-6"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                  <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                </svg>
              )}
              Subscribe
            </button>
          </div>
          <div className="flex items-center gap-2 text-base font-medium">
            {/* like-btn */}
            <div className="flex items-center bg-lightgray rounded-3xl px-3 py-2 ">
              <div
                onClick={likeHandler}
                className="flex gap-1 items-center border-r pr-3 mr-2 cursor-pointer"
              >
                {!liked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-thumb-up"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#000000"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-thumb-up-filled"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#5a5a5a"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z"
                      stroke-width="0"
                      fill="currentColor"
                    />
                    <path
                      d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z"
                      stroke-width="0"
                      fill="currentColor"
                    />
                  </svg>
                )}
                <p>{formattedLikesCount}</p>
              </div>
              <div onClick={dislikeHandler} className="cursor-pointer">
                {disliked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-thumb-down"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#000000"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-thumb-down-filled"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#5a5a5a"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M13 21.008a3 3 0 0 0 2.995 -2.823l.005 -.177v-4h2a3 3 0 0 0 2.98 -2.65l.015 -.173l.005 -.177l-.02 -.196l-1.006 -5.032c-.381 -1.625 -1.502 -2.796 -2.81 -2.78l-.164 .008h-8a1 1 0 0 0 -.993 .884l-.007 .116l.001 9.536a1 1 0 0 0 .5 .866a2.998 2.998 0 0 1 1.492 2.396l.007 .202v1a3 3 0 0 0 3 3z"
                      stroke-width="0"
                      fill="currentColor"
                    />
                    <path
                      d="M5 14.008a1 1 0 0 0 .993 -.883l.007 -.117v-9a1 1 0 0 0 -.883 -.993l-.117 -.007h-1a2 2 0 0 0 -1.995 1.852l-.005 .15v7a2 2 0 0 0 1.85 1.994l.15 .005h1z"
                      stroke-width="0"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </div>
            </div>
            {/* share-btn */}
            <div
              className="flex items-center gap-1 bg-lightgray rounded-3xl px-3 py-2 cursor-pointer "
              onClick={handleShare}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-share-3"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#000000"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z" />
              </svg>
              <p>Share</p>
            </div>
            {/* option-btn */}
            <div className="bg-lightgray rounded-3xl p-2 cursor-pointer ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-dots"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#000000"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-2 bg-lightgray rounded-2xl p-3">
          {/* views */}
          <div className="flex gap-2 font-semibold">
            <p>{formattedViewCount} views</p>
            <p>{relativeTime} </p>
            <p className="text-[#656565]">#tag</p>
          </div>
          {/* description */}
          <div className={`${showFullDescription ? "" : "truncate-2-lines"}`}>
            <p>{video?.snippet?.description}</p>
          </div>
          {!showFullDescription ? (
            <p onClick={toggleDescription} className="cursor-pointer text-blue-500">
              ...more
            </p>
          ): <p onClick={toggleDescription} className="cursor-pointer text-blue-500">
          ...Show less
        </p>}
        </div>
        {/* comments-container */}
        <div>
          <h1>{video?.statistics?.commentCount} Comments</h1>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
