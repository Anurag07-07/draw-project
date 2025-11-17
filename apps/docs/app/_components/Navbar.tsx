import React from 'react'

const Navbar = () => {
  return (
    <div className=' w-full h-24 bg-teal-300 flex justify-center items-center '>
      <div className=' flex justify-between w-full'>
        <div>Logo</div>
        <div>Navbar</div>
        <div className=' hidden/*'>Signup</div>
      </div>
    </div>
  )
}

export default Navbar