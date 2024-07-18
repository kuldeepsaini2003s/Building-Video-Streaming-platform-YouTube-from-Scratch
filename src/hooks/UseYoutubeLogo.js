import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { YOUTUBE_API_KEY } from "../utils/constants";
import { setYoutubeLogo } from "../utils/VideoSlice";

const UseYoutubeLogo = ({ channelId }) => {
  const dispatch = useDispatch();
  const getChannleLogo = async () => {
    try {
      const data = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
      );
      const json = await data.json();
      dispatch(setYoutubeLogo(json));
    } catch (error) {
      console.error("Error fetching channel data:", error);
    }
  };
  useEffect(() => {
    getChannleLogo();
  }, []);
  return;
};

export default UseYoutubeLogo;
