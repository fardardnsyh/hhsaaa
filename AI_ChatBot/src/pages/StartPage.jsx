import React from 'react'
import { useNavigate } from 'react-router-dom'

const StartPage = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/chat');
  }
  const handleAdminButtonClick = () => {
    navigate('/admin');
  }
  return (
    <div className="hero min-h-screen fixed top-0 left-0 right-0 bottom-0" style={{backgroundImage: 'url(https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)'}}>
        <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                    <p className="mb-5 text-md">Use this AI-Powered chat-bot for any course related queries you may have.</p>
                    <div className='flex-col'>
                      <button onClick={handleButtonClick} className="btn btn-primary mb-5 h-[30px] w-[150px]">Chat With AI</button>
                      <br />
                      <button onClick={handleAdminButtonClick} className="btn btn-primary h-[30px] w-[150px]"> Admin </button>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default StartPage