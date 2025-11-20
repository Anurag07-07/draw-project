import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import photo from '../../public/merry-christmas-1093758_1920.jpg'
const Main = () => {
  return (
    <div className=' relative bg-yellow-400 min-h-[calc(100vh-96px)] flex justify-center items-center flex-col'>
      <Image className=' absolute w-full h-full object-cover z-10'  src={photo} alt='background'></Image>
      <div className=' z-20'>

      <div>EDUNAX DRAW APP</div>
      <div>DRAW THE</div>
      <div className=' uppercase'>Imagination</div>
      <div>
        <Link href={'/dashboard'}>Show Dashboard</Link>
      </div>
      </div>
    </div>
  )
}

export default Main