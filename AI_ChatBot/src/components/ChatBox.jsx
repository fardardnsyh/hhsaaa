import { useState, useEffect } from 'react';
import React from 'react'
import Message from './Message'
import NavBar from './NavBar';

const ChatBox = () => {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [rating, setRating] = useState(0)
    const [userQueries, setUserQueries] = useState([])

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        
        // Push user message to messages array
        if (messages.length > 0 && messages[messages.length - 1].name === "Loading") {
            setMessages(messages => messages.slice(0, -1));
        }    
        setMessages(messages => [...messages, { id: messages.length + 1, text: value, name: "User" }]);
        setValue("");
        setMessages(messages=> [...messages, { id: messages.length + 1, text: "", name: "Loading"}])
        
        try {
            const response = await fetch('http://localhost:5000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: value })
            });
            const data = await response.json();
            let chatbot_reply = data["response"]["output_text"]

            setMessages(messages => {const newMessages = [...messages]; newMessages.pop(); return newMessages})
            setMessages(messages => [...messages, { id: messages.length + 1, text: chatbot_reply, name: "Chat Bot" }]);
            if(chatbot_reply.trim() === "I couldn't find relevant information about that in the course description. Is there anything else I can help you with?"){
                
                setUserQueries(userQueries => {
                    const newUserQueries = [...userQueries, value];
                    submitNewQuery(e, value); // Call submitNewQuery with the new query
                    return newUserQueries;
                });
                let support_message = "For detailed information on this topic, contact us at:"
                setMessages(messages => [...messages, { id: messages.length + 1, text: support_message, name: "Chat Bot" }]);
                let support_message2 = "customer_support.gfg@gfg.com"
                setMessages(messages => [...messages, { id: messages.length + 1, text: support_message2, name: "Chat Bot" }]);
                let support_message3 = "or log on to https://www.geeksforgeeks.org/"
                setMessages(messages => [...messages, { id: messages.length + 1, text: support_message3, name: "Chat Bot" }]);
                // setUserQueries(userQueries => [...userQueries, value])
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/submit_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: "user",
                    rating: rating,
                    message: feedbackMsg
                })
            });
            const data = await response.json()
            // console.log(data)
            window.location.reload();
        } catch (error) {
            // console.log("Reaching Here!!")
            console.error('Error submitting feedback:', error);
        }
    };

    const submitNewQuery = async (e, new_query) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:5000/new_query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newquery: new_query
                })
            });
            const data = await response.json()
        } catch (error) {
            console.error('Error in Pushing new Query', error)
        }
    }

    const handleEndChat = (event) => {
        event.preventDefault();
        const feedbackModal = document.getElementById('feedback_modal');
        feedbackModal.showModal();
        feedbackModal.addEventListener('close', () => {
            window.location.reload();
        });
    };

  return (
    <div>
        <NavBar/>
        {messages.length === 0 && (
            <div className='flex flex-col items-center justify-center h-[400px]'>
            <img className='rounded-xl mb-4' src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png" alt="GFG Logo" height={60} width={60} />
            <h1 className='text-center'> Hello User, If you have any query regarding any course,</h1> 
            <h1 className='text-center'> ask the Chat-Bot </h1>
        </div>
        )}
        <div className='rounded-xl'>
            <div className='py-40 pt-20 containerWrap'>
                {messages.map(message => (
                    <Message key={message.id} message={message} />
                ))}
            </div>
        </div>
        
        <div className='bg-gray-300 rounded-xl fixed bottom-0 left-0 right-0 z-50 shadow-lg mb-2'>
            <form onSubmit={handleSendMessage} className=' px-2 containerWrap p-4 flex'>
            {messages.length > 0 && (
                <button type="button" onClick={handleEndChat} className='bg-red-500 text-white rounded-xl px-5 mr-3 text-md'>End </button>
                )}
                <input value={value} onChange={e => setValue(e.target.value)} className="input w-full focus:outline-none bg-gray-200 rounded-r-none text-black shadow-lg" type="text" />
                <button type="submit" className='w-auto bg-blue-500 text-white rounded-r-xl px-5 text-md'> Send </button>
                
            </form>
        </div>

        <dialog id="feedback_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Hello User!</h3>
                <p className="py-4"> Please provide feedback on your experience of using the Chat Bot</p>
                <div className="modal-action">
                <form onSubmit={submitFeedback} className="flex flex-row items-center justify-center" method="dialog">
                    <div className='flex flex-col items-center'>
                        <input type="text" value={feedbackMsg} onChange={e => setFeedbackMsg(e.target.value)} placeholder="Type Feedback Here" className="input input-bordered input-secondary w-full max-w-xs" />
                        <div className="rating rating-lg mt-2">
                            <input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" value='1' onChange={e => setRating(parseInt(e.target.value))} checked={rating === 1 || rating === 0}/>
                            <input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" value='2' onChange={e => setRating(parseInt(e.target.value))} checked={rating === 2}/>
                            <input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" value='3' onChange={e => setRating(parseInt(e.target.value))} checked={rating === 3}/>
                            <input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" value='4' onChange={e => setRating(parseInt(e.target.value))} checked={rating === 4}/>
                            <input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" value='5' onChange={e => setRating(parseInt(e.target.value))} checked={rating === 5}/>
                        </div>
                    </div>
                    <button type="submit" className="btn ml-12 bg-gray-600"> Submit </button>
                </form>
                </div>
            </div>
        </dialog>
    </div>
  )
}

export default ChatBox