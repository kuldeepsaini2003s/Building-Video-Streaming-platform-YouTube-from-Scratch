import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSingleVideo } from "../utils/VideoSlice";
import { BACKEND_VIDEO, LOCAL_BACKEND_VIDEO } from "../utils/constants";

const UseSingleVideo = (videoId) => {
  const dispatch = useDispatch();
  const getSingleVideo = async () => {
    const data = await fetch(LOCAL_BACKEND_VIDEO + `/getVideo/${videoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const json = await data.json();
    dispatch(setSingleVideo(json?.data));
  };
  useEffect(() => {
    getSingleVideo();
  }, [videoId]);
};

export default UseSingleVideo;
