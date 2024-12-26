import { useDispatch } from "react-redux";
import { setUserVideos } from "../utils/VideoSlice";
import { BACKEND_VIDEO } from "../utils/constants";
import { useEffect } from "react";
import { useParams } from "react-router";

const UseFetchUserVideos = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const fetchUserVideos = async () => {
    try {
      const response = await fetch(BACKEND_VIDEO + `/getUserAllVideo/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        dispatch(setUserVideos(data?.data));
      }
    } catch (error) {
      console.error("Error while fetching user videos", error);
    }
  };
  useEffect(() => {
    fetchUserVideos();
  }, [id]);
};

export default UseFetchUserVideos;
