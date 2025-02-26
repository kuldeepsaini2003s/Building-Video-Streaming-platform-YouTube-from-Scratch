import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSingleVideo } from "../utils/VideoSlice";
import { BACKEND_VIDEO } from "../utils/constants";

const UseSingleVideo = (videoId) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getSingleVideo = async () => {
    const data = await fetch(BACKEND_VIDEO + `/getVideo/${videoId}`, {
      user: user && user?._id,
    });
    const json = await data.json();
    dispatch(setSingleVideo(json?.data));
  };
  useEffect(() => {
    getSingleVideo();
  }, [videoId]);
};

export default UseSingleVideo;
