import React from 'react'
const Categories = () => {
 
  return (
    <div className='overflow-x-auto fixed -z-50 top-[5rem] left-[6rem] w-full'>
    <div className='flex gap-3 m-2 items-center'>
        <div className="categories-icon px-3 py-1 h-8 rounded-xl  cursor-pointer text-sm font-semibold">All</div>
        <div className="categories-icon px-3 py-1 h-8 rounded-xl  cursor-pointer text-sm font-semibold">Mixes</div>
        <div className="categories-icon px-3 py-1 h-8 rounded-xl  cursor-pointer text-sm font-semibold">Gaming</div>
        <div className="categories-icon px-3 py-1 h-8 rounded-xl  cursor-pointer text-sm font-semibold">Music</div>
        <div className="categories-icon px-3 py-1 h-8 rounded-xl  cursor-pointer text-sm font-semibold">Live</div>
        <div className="categories-icon px-3 py-1 h-8 rounded-xl  cursor-pointer text-sm font-semibold">Street food</div>
        <div className="categories-icon px-3 py-1 h-8 rounded-xl  cursor-pointer text-sm font-semibold">Recently uploaded</div>
        <div className="categories-icon px-3 py-1 h-8 rounded-xl  cursor-pointer text-sm font-semibold">T-Series</div>
        <div className="categories-icon px-3 py-1 h-8 rounded-xl  cursor-pointer text-sm font-semibold">Carry minati</div>
    </div>
    </div>
  )
}

export default Categories