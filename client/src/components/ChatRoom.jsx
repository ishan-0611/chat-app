import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './ChatRoom.css';

const socket = io('http://localhost:5001');

const COLORS = ['#e74c3c', '#8e44ad', '#3498db', '#16a085', '#f39c12', '#2ecc71', '#d35400'];

const getUserDetails = () => {
  let username = localStorage.getItem('chat_username');
  let color = localStorage.getItem('chat_user_color');

  if (!username) {
    username = prompt('Enter your name:');
    localStorage.setItem('chat_username', username);
  }

  if (!color) {
    color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    localStorage.setItem('chat_user_color', color);
  }

  return { username, color };
};

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userColors, setUserColors] = useState({});
  const { username, color } = getUserDetails();

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const getUserColor = (username) => {
    if (!userColors[username]) {
      const newColor = COLORS[Object.keys(userColors).length % COLORS.length];
      setUserColors(prev => ({ ...prev, [username]: newColor }));
      return newColor;
    }
    return userColors[username];
  };

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('chat message', {
        username,
        color,
        text: input
      });
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-box">
        {messages.map((msg, index) => (
          <div key={index} style={{ padding: "6px 10px" }}>
            <strong style={{ color: getUserColor(msg.username) }}>
              [{msg.username}]:
            </strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
