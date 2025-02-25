import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BACKEND_LIKE } from "../utils/constants";

const UseLikeHandler = (videoId) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const video = useSelector((store) => store?.videos?.singleVideo);

  useEffect(() => {
    if (video) {
      setLiked(video?.isLiked);
      setDisliked(video?.isDisliked);
      setLikesCount(video?.likesCount);
    }
  }, [video]);

  const likeHandler = async () => {
    if (!liked) {
      setLikesCount(likesCount + 1);
      try {
        await fetch(BACKEND_LIKE + `/likeVideo/${videoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Error while liking a video", error);
      }
      setLiked(true);
      setDisliked(false);
    }
  };

  const dislikeHandler = async () => {
    if (!disliked) {
      setLikesCount(likesCount - 1);
      try {
        await fetch(BACKEND_LIKE + `/disLikeVideo/${videoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Error while liking a video", error);
      }
      setDisliked(true);
      setLiked(false);
    }
  };

  return { liked, disliked, likesCount, likeHandler, dislikeHandler };
};

export default UseLikeHandler;
