import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext';

const Loading = () => {

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className='border-4 border-violet-600  rounded-full h-12 w-12 border-t-transparent animate-spin'></div>
    </div>
  )
}

export default Loading