import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const subscriberHandler = () => {
    setSubscribed((prevSubscribed) => !prevSubscribed);
  };
  console.log(searchParams.get("v"));
  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    alert("URL copied to clipboard!");
  };
  return (
    <div className=" mx-10 my-2">
      <div className="">
        <iframe
          width="800"
          height="400"
          className="rounded-xl"
          src={"https://www.youtube.com/embed/" + searchParams.get("v")}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay ; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      {/* channel-info */}
      <div className="flex flex-col gap-3 m-1 justify-center">
        {/* Channel name */}
        <h1 className=" text-xl">
          I Got Surprised with Rs10,00,000 MYSTERY BOXES in my NEW HOUSE
        </h1>
        <div className="flex items-center gap-5">
          {/* user-profile */}
          <div className="flex gap-5 items-center">
            <img
              className="h-14 w-14 rounded-full"
              src={require("../Images/thumbnail-1.jpeg")}
              alt=""
            />
            <div>
              <p>Fukra Insaan</p>
              <p className="text-xs text-[#656565]">23M subscribers</p>
            </div>
          </div>
          {/* subscribe-btn */}
          <button
            onClick={subscriberHandler}
            className="bg-black text-white px-3 py-1.5 flex items-center cursor-pointer rounded-3xl"
          >
            {subscribed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-bell"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#ffffff"
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
          {/* like-btn */}
          <div className="flex items-center bg-lightgray rounded-3xl px-3 py-1.5">
            <div className="flex items-center border-r pr-3 mr-3 cursor-pointer gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-thumb-up"
                width="28"
                height="28"
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
              <p>1.8K</p>
            </div>
            <div className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-thumb-down"
                width="28"
                height="28"
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
            </div>
          </div>
          {/* share-btn */}
          <div
            className="flex items-center gap-4 bg-lightgray rounded-3xl px-3 py-1.5 cursor-pointer "
            onClick={handleShare}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-share-3"
              width="28"
              height="28"
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
          {/* download-btn */}
          <div className="flex items-center gap-2 bg-lightgray rounded-3xl px-3 py-1.5 cursor-pointer ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-download"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#000000"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <path d="M7 11l5 5l5 -5" />
              <path d="M12 4l0 12" />
            </svg>
            <p>Download</p>
          </div>
          {/* option-btn */}
          <div className="bg-lightgray rounded-3xl p-2 cursor-pointer ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-dots"
              width="28"
              height="28"
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

        <div className="flex flex-col  bg-lightgray rounded-2xl p-3 w-[800px]">
          {/* views */}
          <div className="flex gap-2 font-semibold">
            <p>432,542,623 viwes</p>
            <p>2 years ago</p>
            <p className="text-[#656565]">#tag</p>
          </div>
          {/* description */}
          <div className="">
            <p>
              This beat is not copied or stolen. It's produced by me and AP
              Dhillon rightfully purchased this beat off me and now owns the
              exclusive rights. I'm grateful to have been part of this record{" "}
            </p>
          </div>
        </div>
        {/* comments-container */}
        <div>
          <h1>13,987 Comments</h1>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
