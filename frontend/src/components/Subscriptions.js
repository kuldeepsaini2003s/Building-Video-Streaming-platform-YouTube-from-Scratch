import React, { useEffect, useState } from "react";
import bell_icon_white from "../Icons/Bell-icon-white.json";
import Lottie from "lottie-react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  BACKEND_SUBSCRIPTION,

} from "../utils/constants";

const Subscriptions = () => {
  const [showPop, setShowPop] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [channelName, setChannelName] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  const user = useSelector((store) => store?.user?.user);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(
        BACKEND_SUBSCRIPTION + "/subscribedChannels",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setSubscriptions(response?.data?.data);
      }
    } catch (error) {
      console.error("Error while fetching subscriptions");
      setSubscriptions([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const handleConfirmation = async () => {
    try {
      const response = await axios.get(
        BACKEND_SUBSCRIPTION + `/unsubscribe/${channelName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        fetchSubscriptions();
      }
    } catch (error) {
      console.error("Error while subscribing channel", error);
    }
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
              onClick={() => {
                setShowPop(false);
                setChannelName("");
              }}
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

  return (
    <div className="relative px-20 py-5" id="main">
      <h1 className="font-bold text-xl">All Subscriptions</h1>
      <div>
        {subscriptions.length > 0 ? (
          subscriptions.map((item) => (
            <div
              key={item._id}
              className="flex gap-10 items-center w-full my-4"
            >
              <img
                src={item?.avatar}
                className="w-32 h-32  object-cover object-center rounded-full flex-shrink-0"
                alt="Avatar"
              />
              <div className="space-y-1 text-Lightblack text-sm w-full">
                <h1 className="text-xl text-white font-bold">
                  {item?.channelName}
                </h1>
                <p>
                  {item?.userName}. {item?.subscribers} Subscribers
                </p>
                <p className="leading-5">{item?.description}</p>
              </div>
              <button
                onClick={() => {
                  setChannelName(item?.channelName);
                  setShowPop(true);
                }}
                className="watch-btn subscriber px-3 py-2 dark:bg-icon_black dark:hover:bg-hover_icon_black flex gap-1 items-center text-sm cursor-pointer rounded-3xl"
              >
                <Lottie
                  animationData={bell_icon_white}
                  play={isPlaying}
                  loop={false}
                  className="w-6"
                />
                Subscribed
              </button>
            </div>
          ))
        ) : (
          <p>You have not subscribed anyone</p>
        )}
      </div>
      {showPop && <ConfirmationPop />}
    </div>
  );
};

export default Subscriptions;
