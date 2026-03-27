import React from 'react'
import Home from './(pages)/home/page'
import { Navbar } from '@/components/ui/Navbar'

function page() {
  return (
    <div>
      <div className='relative'>
        <Navbar />
      </div>
      <div>
        <Home/>
      </div>
    </div>
  )
}

export default page