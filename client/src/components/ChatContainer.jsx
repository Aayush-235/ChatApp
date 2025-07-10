import React, { useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../library/utils';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const scrollEnd = useRef();

  const { messages, selectedUser, setSelectedUser, sendMessages, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState('');

  // Function to handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return null;
    await sendMessages({ text: input.trim() })
    setInput('');
  }

  // Function to handle sending img
  const handleSendImg = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a img file');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      await sendMessages({ image: reader.result })
      e.target.value = ''
    }
    reader.readAsDataURL(file);


  }

  useEffect(() => {
    if (selectedUser && messages) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser])

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return selectedUser ? (
    <>
      <div className='h-full overflow-scroll relative backdrop-blur-lg'>


        {/* This is header */}
        <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>

          <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />

          <p className=' flex flex-1 text-lg text-white items-center gap-2'>
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
          </p>

          <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} className='max-w-7' alt="" />

          <img src={assets.help_icon} className='max-w-5' alt="" />

        </div>


        {/* this is chat area... */}
        <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-2'>

          {messages && messages.map((msg, index) =>
          (
            <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
              {
                msg.image ? (
                  <img src={msg.image} className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8" alt="" />
                ) : (
                  <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'
                    }`}>{msg.text}</p>
                )
              }

              <div className='text-center text-xs'>
                <img src={msg.senderId === authUser._id
                  ? (authUser.profilePic ? authUser.profilePic : assets.avatar_icon)
                  : (selectedUser.profilePic ? selectedUser.profilePic :assets.avatar_icon)} alt="" className='w-7 rounded-full' />

                <p className='text-gray-300'>{formatMessageTime(msg.createdAt)}</p>

              </div>

            </div>
          ))}
          <div ref={scrollEnd}></div>
        </div>



        {/* This is message typing area */}
        <div className='absolute border-0 left-0 right-0 flex items-center gap-3 p-3 '>

          <div className='flex flex-1 items-center bg-gray-100/12 px-3 rounded-full'>

            <input onChange={(e) => setInput(e.target.value)} value={input}
              onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage(e) : null}
              type="text" placeholder='Send a message...'
              className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400" />

            <input onChange={handleSendImg} type="file" id="image" accept='image/png, image/jpeg , image/jpg' className="hidden" />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
            </label>

          </div>
          <img onClick={handleSendMessage} src={assets.send_button} className='w-7 cursor-pointer' alt="" />

        </div>


      </div>

    </>
  )
    :
    (
      <>
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
          <img src={assets.logo_icon} className='max-w-16' alt="" />
          <p className='text-lg font-medium text-white'>Typing... is just the beginning..</p>
        </div>
      </>
    )
}

export default ChatContainer
