
import React, { useEffect, useState } from 'react'
import { YOUTUBE_VIDEOS_API } from '../utils/constants'
import {Link} from 'react-router-dom'
import VideoCard from './VideoCard';

const VideoContainer = () => {
  const [videos, setVideos] =useState([]);
  const getvideos = async()=>{
    const data = await fetch (YOUTUBE_VIDEOS_API)
    const json = await data.json();
    console.log(json)
    setVideos(json.items)
  }
  console.log(videos)
  useEffect(()=>{
    getvideos()
  },[])
  return (
    <div className="flex fixed -z-50 top-[9rem] overflow-y-auto max-h-screen  w-full left-[3rem] flex-wrap gap-2 justify-center">
      {videos.map((video)=>(
        <Link key={video.id} to={"/watch?v="+video.id}>
        <VideoCard info={video}/>
        </Link>
      ))}
    </div>
  )
}

export default VideoContainer