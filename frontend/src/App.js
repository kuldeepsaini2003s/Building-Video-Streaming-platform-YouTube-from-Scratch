import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Body from "./components/Body";
import WatchPage from "./components/WatchPage";
import React, { useEffect, useState } from "react";
import Shimmer from "./components/Shimmer";
import VideoContainer from "./components/VideoContainer";
import { useDispatch } from "react-redux";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { BACKEND_USER } from "./utils/constants";
import { setUser } from "./utils/userSlice";
import CreateVideo from "./components/CreateVideo";
import Channel from "./components/Channel";
import Navbar from "./components/Navbar";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      {
        path: "/",
        element: <VideoContainer />,
      },
      {
        path: "/create-video",
        element: <CreateVideo />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/:id",
        element: <Channel />,
      },
    ],
  },
  {
    path: "watch",
    element: <WatchPage />,
  },
]);

function App() {
  const [loading, setLoading] = useState(true);

  const userToken = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(BACKEND_USER + "/getUserDetails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          dispatch(setUser(data.data));
        }
      } catch (error) {
        console.log("error while checking token", error);
      }
    };
    fetchUser();
  }, [userToken]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add("className", savedTheme);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Shimmer />
      ) : (
        <>
          <RouterProvider router={AppRouter}>
            <Navbar />
          </RouterProvider>
        </>
      )}
    </>
  );
}

export default App;
