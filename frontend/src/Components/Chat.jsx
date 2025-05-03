import React, { useState } from 'react';

const Chat = () => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    // Logic to send message (perhaps with Socket.io)
    console.log("Message sent:", message);
    setMessage("");
  };

  return (
    <div className="chat">
      <div className="messages">
        {/* Display chat messages here */}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
