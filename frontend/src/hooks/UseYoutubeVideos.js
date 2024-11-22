import { useDispatch } from "react-redux";
import { setYoutubeVideo } from "../utils/VideoSlice";
import { YOUTUBE_API_KEY } from "../utils/constants";
import { useEffect } from "react";

const UseYoutubeVideos = () => {
  const dispatch = useDispatch();
  const getVideos = async () => {
    const data = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&key=${YOUTUBE_API_KEY}`
    );
    const json = await data.json();
    dispatch(setYoutubeVideo(json.items));
  };

  useEffect(() => {
    getVideos();
  }, []);
};

export default UseYoutubeVideos;
