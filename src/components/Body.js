import React from 'react'
import { Outlet } from 'react-router'
import Menu from './Menu'
const Body = () => {
  return (
    <div className='flex'>
      <Outlet/>
    </div>
  )
}

export default Body