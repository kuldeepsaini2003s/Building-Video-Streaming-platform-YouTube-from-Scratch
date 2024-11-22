import { createBrowserRouter, Outlet, Router, RouterProvider } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import MainContainer from "./components/MainContainer";
import WatchPage from "./components/WatchPage";
import { useEffect, useState } from "react";
import Shimmer from "./components/Shimmer";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      {
        path: "/",
        element: <MainContainer />,
      },
      {
        path: "watch",
        element: <WatchPage />,
      },
    ],
  },
]);

function App() {
  const [loading, setLoading] = useState(true);  
    
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
          <div className="navbar-show">
            <Navbar />
          </div>          
          <RouterProvider router={AppRouter}/>        
          </>
        )}        
    </>              
  );
}

export default App;
