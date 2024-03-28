import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import UseSingleVideo from "../hooks/UseSingleVideo";
import { useDispatch, useSelector } from "react-redux";
import { GOOGLE_API_KEY } from "../utils/constants";
import Image from "../Images/user.avif";
import LiveChats from "./LiveChats";
import { setMessages } from "../utils/ChatSlice";

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
  const [channelLogo, setChannelLogo] = useState("")
  const dispatch = useDispatch();

  UseSingleVideo({ videoId });
  const getSignleVideo = useSelector((store) => store.videos.singlevideo);

  useEffect(() => {
    if (getSignleVideo) {
      setVideo(getSignleVideo);
    }
  }, [getSignleVideo]);

  // console.log(video)

  const { snippet, statistics } = video;
  const Id = video?.snippet?.channelId;
  console.log(Id);
  const tags = video?.snippet?.tags;
  // console.log(tags);
  const publishedAt = snippet ? snippet.publishedAt : null;

  const getChannleLogo = async () => {
    try {
      const data = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${Id}&key=${GOOGLE_API_KEY}`
      );
      const json = await data.json();
      console.log(json.items[0].snippet.thumbnails.high.url);
      setChannelLogo(json.items[0].snippet.thumbnails.high.url)
    } catch (error) {
      console.error("Error fetching channel data:", error);
    }
  };
  useEffect(() => {
    if(Id) {
      getChannleLogo();
    }
  }, [Id]);

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
    <div className="mt-20 w-full flex gap-16">
      {/* left  */}
      <div className="ml-20 w-[700px] ">
        {/* video */}
        <div className="">
          <iframe
            width="700"
            height="380"
            className="rounded-xl"
            src={`https://www.youtube.com/embed/${videoId}`}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
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
                className="watch-btn subscriber px-3 py-2 flex items-center text-sm cursor-pointer rounded-3xl"
              >
                {subscribed && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="like-btn icon icon-tabler icon-tabler-bell h-6 mr-1"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#000000 "
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                  </svg>
                )}
                {!subscribed ? "Subscribe" : "Subscribed"}
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              {/* like-btn */}
              <div className="user-info flex items-center bg-lightgray rounded-3xl ">
                <div
                  onClick={likeHandler}
                  className="watch-btn flex gap-1 items-center border-r  px-3 py-2 rounded-full rounded-r   cursor-pointer"
                >
                  {!liked ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="like-btn icon icon-tabler icon-tabler-thumb-up"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#000000"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="like-btn icon icon-tabler icon-tabler-thumb-up-filled"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#5a5a5a"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z"
                        strokeWidth="0"
                        fill="currentColor"
                      />
                      <path
                        d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z"
                        strokeWidth="0"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  <p>{formattedLikesCount}</p>
                </div>
                <div
                  onClick={dislikeHandler}
                  className="cursor-pointer px-4 py-2 rounded-full rounded-l watch-btn"
                >
                  {disliked ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="like-btn icon icon-tabler icon-tabler-thumb-down"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#000000"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="like-btn icon icon-tabler icon-tabler-thumb-down-filled"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#5a5a5a"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M13 21.008a3 3 0 0 0 2.995 -2.823l.005 -.177v-4h2a3 3 0 0 0 2.98 -2.65l.015 -.173l.005 -.177l-.02 -.196l-1.006 -5.032c-.381 -1.625 -1.502 -2.796 -2.81 -2.78l-.164 .008h-8a1 1 0 0 0 -.993 .884l-.007 .116l.001 9.536a1 1 0 0 0 .5 .866a2.998 2.998 0 0 1 1.492 2.396l.007 .202v1a3 3 0 0 0 3 3z"
                        strokeWidth="0"
                        fill="currentColor"
                      />
                      <path
                        d="M5 14.008a1 1 0 0 0 .993 -.883l.007 -.117v-9a1 1 0 0 0 -.883 -.993l-.117 -.007h-1a2 2 0 0 0 -1.995 1.852l-.005 .15v7a2 2 0 0 0 1.85 1.994l.15 .005h1z"
                        strokeWidth="0"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {/* share-btn */}
              <div
                className="watch-btn user-info flex items-center gap-1 bg-lightgray rounded-3xl px-3 py-2 cursor-pointer "
                onClick={handleShare}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="like-btn icon icon-tabler icon-tabler-share-3"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#000000"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z" />
                </svg>
                <p>Share</p>
              </div>
              {/* option-btn */}
              <div className="watch-btn bg-lightgray rounded-3xl p-2 cursor-pointer ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="like-btn icon icon-tabler icon-tabler-dots"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#000000"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                </svg>
              </div>
            </div>
          </div>

          <div className="user-info gap-2 flex flex-col mt-2 text-sm bg-lightgray rounded-2xl p-3">
            {/* views */}
            <div className="flex items-center gap-x-2 font-semibold flex-wrap ">
              <p className="p-0 m-0">{formattedViewCount} views</p>
              <p className="p-0 m-0">{relativeTime} </p>
              {tags &&
                tags.length > 0 &&
                tags.map((tag, index) => (
                  <div key={index}>
                    {" "}
                    <p className="text-[#656565] p-0 m-0 white">#{tag}</p>
                  </div>
                ))}
            </div>
            {/* description */}
            <div className={`${showFullDescription ? "" : "truncate-2-lines"}`}>
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
            <h1>{video?.statistics?.commentCount} Comments</h1>
          </div>
        </div>
      </div>
      {/* right */}
      <div className="border flex flex-col justify-between w-[30%] h-fit rounded-lg ">
        <div className="flex justify-between items-center border-b p-4">
          <p>Top Chats</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-dots-vertical"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#ffffff"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          </svg>
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
            onKeyDown={(e) =>{
              if(e.key === 'Enter'){
                sendMessage();
              }
            }}
          />
          {/* Send button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-send-2"
            onClick={sendMessage}
            width="28"
            height="28"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#ffffff"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
            <path d="M6.5 12h14.5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
