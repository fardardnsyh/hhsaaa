import React from 'react'

const Message = ({message}) => {
  return (
    <div>
        {message.name === "Chat Bot"? 
            <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png" />
                </div>
            </div>
            <div className="chat-header">
                {message.name}
            </div>
            <div className="chat-bubble">{(message.text)}</div>
            </div>:
            message.name === "Loading"?
            <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png" />
                </div>
            </div>
            <div className="chat-header">
                Chat Bot
            </div>
                <span className="loading loading-dots loading-lg"></span>
            </div>
            :
            <div className="chat chat-end">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src="https://w7.pngwing.com/pngs/419/473/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png" />
                </div>
            </div>
            <div className="chat-header text-white">
                {message.name}
            </div>
            <div className="chat-bubble  bg-blue-600 text-white"> {message.text} </div>
            </div>
        }
        
    </div>
  )
}

export default Message