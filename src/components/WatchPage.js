import React from "react";

const WatchPage = () =>{
    const videoId="upDhKSx7P7E"
    return(
    <>
    <div>
    <iframe width="850" height="550" 
    src={"https://www.youtube.com/embed/"+videoId}
     title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    
    </div>
    </>

)}

export default WatchPage;