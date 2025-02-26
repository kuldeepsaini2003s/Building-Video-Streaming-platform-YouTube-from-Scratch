import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import WatchPage from "./components/WatchPage";
import React, { useEffect, useState } from "react";
import VideoContainer from "./components/VideoContainer";
import { useDispatch } from "react-redux";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { BACKEND_USER } from "./utils/constants";
import { setUser } from "./utils/userSlice";
import CreateVideo from "./components/CreateVideo";
import Channel from "./components/Channel";
import MainLayout from "./components/MainLayout";
import CustomizeChannel from "./components/CustomizeChannel";
import {
  UserAbout,
  UserAllVideo,
  UserCommunity,
  UserPlaylist,
} from "./components/userChannelCollection";
import UpdateVideo from "./components/UpdateVideo";
import LoginBlocker from "./utils/LoginBlocker";
import Subscriptions from "./components/Subscriptions";
import History from "./components/History";
import axios from "axios";
import UserChannel from "./components/UserChannel";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <LoginBlocker />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/signup",
            element: <SignUp />,
          },
        ],
      },
      {
        path: "/",
        element: <VideoContainer />,
      },
      {
        path: "/create-video",
        element: <CreateVideo />,
      },
      {
        path: "/update-video/:videoId",
        element: <UpdateVideo />,
      },
      {
        path: "/subscriptions",
        element: <Subscriptions />,
      },
      {
        path: "/history",
        element: <History />,
      },
      { path: "/feed/you", element: <UserChannel /> },
      {
        path: "/:userName",
        element: <Channel />,
        children: [
          {
            index: true,
            element: <UserAllVideo />,
          },
          {
            path: "videos",
            element: <UserAllVideo />,
          },
          {
            path: "playlists",
            element: <UserPlaylist />,
          },
          {
            path: "community",
            element: <UserCommunity />,
          },
          {
            path: "about",
            element: <UserAbout />,
          },
        ],
      },
      {
        path: "/customize-channel",
        element: <CustomizeChannel />,
      },
      {
        path: "watch",
        element: <WatchPage />,
      },
    ],
  },
]);

function App() {
  const userToken = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAccessToken = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const response = await axios.get(BACKEND_USER + "/refresh_token", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      });
      if (response.status === 200) {
        // window.location.reload();
        localStorage.setItem("token", response?.data?.accessToken);
        localStorage.setItem("refreshToken", response?.data?.refreshToken);
      }
    } catch (error) {
      console.error("Error while refreshing the user token", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(BACKEND_USER + "/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
        const data = await response.json();
        if (response.status === 401) {
          refreshAccessToken();
        }
        if (response.status === 200) {
          dispatch(setUser(data.data));
          setIsRefreshing(false);
        }
      } catch (error) {
        console.log("error while checking token", error);
      }
    };
    if (userToken) {
      fetchUser();
    }
  }, [userToken]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add("className", savedTheme);
  }, []);

  return (
    <>    
      <RouterProvider router={AppRouter} />
    </>
  );
}

export default App;
