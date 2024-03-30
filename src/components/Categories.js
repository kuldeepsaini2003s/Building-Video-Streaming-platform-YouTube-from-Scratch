import React from 'react'
const Categories = () => {
 
  return (
    <div className='no-scrollbar overflow-x-auto fixed -z-50 sm:top-[4rem] sm:left-[6rem] ms:top-[3.6rem] ms:left-0 w-full '>
    <div className='flex sm:gap-3 ms:gap-2 sm:m-2 ms:my-2 ms:mx-1 items-center'>
        <div className="categories-icon px-3  py-1.5 h-8 min-w-fit rounded-xl  cursor-pointer font-semibold">All</div>
        <div className="categories-icon px-3  py-1.5 h-8 min-w-fit rounded-xl  cursor-pointer font-semibold">Mixes</div>
        <div className="categories-icon px-3  py-1.5 h-8 min-w-fit rounded-xl  cursor-pointer font-semibold">Gaming</div>
        <div className="categories-icon px-3  py-1.5 h-8 min-w-fit rounded-xl  cursor-pointer font-semibold">Music</div>
        <div className="categories-icon px-3  py-1.5 h-8 min-w-fit rounded-xl  cursor-pointer font-semibold">Live</div>
        <div className="categories-icon px-3  py-1.5 h-8 min-w-fit rounded-xl  cursor-pointer font-semibold">Street food</div>
        <div className="categories-icon px-3  py-1.5 h-8 min-w-fit rounded-xl  cursor-pointer font-semibold">Recently uploaded</div>
        <div className="categories-icon px-3  py-1.5 h-8 min-w-fit rounded-xl  cursor-pointer font-semibold">T-Series</div>
        <div className="categories-icon px-3  py-1.5 h-8 min-w-fit rounded-xl  cursor-pointer font-semibold">Carry minati</div>
    </div>
    </div>
  )
}

export default Categories