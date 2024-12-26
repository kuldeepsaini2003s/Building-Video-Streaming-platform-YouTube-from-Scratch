import { useDispatch } from "react-redux";
import { setAllVideos } from "../utils/VideoSlice";
import { BACKEND_VIDEO, LOCAL_BACKEND_VIDEO } from "../utils/constants";
import { useEffect } from "react";

const UseFetchAllVideos = () => {
  const dispatch = useDispatch();
  const fetchUserVideos = async () => {
    try {
      const response = await fetch(LOCAL_BACKEND_VIDEO + `/getAllVideo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        dispatch(setAllVideos(data?.data));
      }
    } catch (error) {
      console.error("Error while fetching user videos", error);
    }
  };
  useEffect(() => {
    fetchUserVideos();
  }, []);
};

export default UseFetchAllVideos;
