import React, { useEffect } from "react";
import { YOUTUBE_API_KEY } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setYoutubeComments } from "../utils/VideoSlice";

const UseYoutubeComments = ({ videoId }) => {
  const dispatch = useDispatch();
  const getYoutubeComments = async () => {
    const data = await fetch(
      `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const json = await data.json();
    // console.log(json?.items);
    dispatch(setYoutubeComments(json?.items));
  };

  useEffect(() => {
    getYoutubeComments();
  }, []);
};

export default UseYoutubeComments;
