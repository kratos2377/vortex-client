import React from 'react'

const SocketConnectionLoading = () => {
  return (
    <div className='text-2xl flex justify-center items-center text-white h-[calc(100vh-10rem)] items-center justify-center'>
        Trying to connect to socket
<span className="loading loading-ring loading-lg text-white ml-2"></span>
    </div>
  )
}

export default SocketConnectionLoading