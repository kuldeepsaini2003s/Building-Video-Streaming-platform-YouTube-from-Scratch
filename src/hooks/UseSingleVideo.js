import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSingleVideo } from "../utils/VideoSlice";
import { GOOGLE_API_KEY } from "../utils/constants";

const UseSingleVideo = ({videoId}) => {
  // console.log(videoId)
  const dispatch = useDispatch();
  const getSignleVideo = async () => {
    const data = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&maxResults=50&regionCode=IN&key=${GOOGLE_API_KEY}`
    );
    const json = await data.json();
    // console.log(json.items[0])
    dispatch(setSingleVideo(json?.items[0])); 
  };
  useEffect(() => {
    getSignleVideo();
  }, []);
};

export default UseSingleVideo;
