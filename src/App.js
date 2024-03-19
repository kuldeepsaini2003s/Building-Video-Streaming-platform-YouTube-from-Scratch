import {  RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Body from './components/Body';
import MainContainer from './components/MainContainer';
import { Provider } from 'react-redux';
import store from './utils/store';
import WatchPage from './components/WatchPage';
import { useEffect, useState } from 'react';
import Slider from './components/Slider';
import Shimmer from './components/Shimmer';

const appRouter=createBrowserRouter([
  {
    path:"/",
    element:<Body/>,
    children:[
      {
        path:"/",
        element:<MainContainer/>
      },
      {
        path:"watch",
        element:<WatchPage/>
      }
    ]
  }

])


function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  const [toggle, setToggle] = useState(false)
  const [theme, setTheme] = useState("light");
  return (
    <Provider store={store}>
      {loading ? (<Shimmer/>) : (
        <>
        <Navbar setToggle={setToggle} theme={theme} setTheme={setTheme}/>
        {toggle && <Slider setToggle={setToggle}/>}
        <RouterProvider router={appRouter}></RouterProvider>
        </>
      )}
    </Provider>
  );
}

export default App;
