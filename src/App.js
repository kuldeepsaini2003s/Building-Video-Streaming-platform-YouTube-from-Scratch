import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Body from './components/Body';
import MainContainer from './components/MainContainer';
import { Provider } from 'react-redux';
import store from './utils/store';
import WatchPage from './components/WatchPage';
import { useState } from 'react';
import Slider from './components/Slider';

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
      {toggle && <Slider setToggle={setToggle} toggle={toggle}/>}
      <RouterProvider router={appRouter}/>
    </Provider>
  );
}

export default App;
