import React from 'react'
import { Outlet } from 'react-router'
import Menu from './Menu'

const Body = () => {
  return (
    <div className='grid grid-flow-col'>
      <Menu/>
      <Outlet/>
    </div>
  )
}

export default Body