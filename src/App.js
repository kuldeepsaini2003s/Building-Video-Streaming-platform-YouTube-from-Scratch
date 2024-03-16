import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Body from './components/Body';
import MainContainer from './components/MainContainer';
import { Provider } from 'react-redux';
import store from './utils/store';
import WatchPage from './components/WatchPage';
import { useState } from 'react';
import Slider from './components/Slider';
import Categories from './components/Categories';
import Menu from './components/Menu';

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
  const [toggle, setToggle] = useState(false)
  return (
    <Provider store={store}>
      <Navbar setToggle={setToggle}/>
      {toggle && <Slider setToggle={setToggle}/>}
      <RouterProvider router={appRouter}></RouterProvider>
    </Provider>
  );
}

export default App;
