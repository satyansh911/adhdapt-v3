import React from 'react'
import Home from './(pages)/home/page'
import { NavigationMenuDemo } from '@/components/ui/Navbar'

function page() {
  return (
    <div>
      <div>
        <NavigationMenuDemo/>
      </div>
      <div>
        <Home/>
      </div>
    </div>
  )
}

export default page