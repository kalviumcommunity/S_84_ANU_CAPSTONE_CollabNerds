import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserList = ({ users }) => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  // This function will navigate to the ChatWindow component
  const handleChatClick = (partnerId) => {
    navigate(`/chat/${partnerId}`); // Navigates to the chat with the clicked user
  };

  return (
    <div>
      <h2>Chat Partners</h2>
      {users.map((user) => (
        <div key={user.id} onClick={() => handleChatClick(user.id)} style={{ cursor: 'pointer' }}>
          <h4>{user.name}</h4>
        </div>
      ))}
    </div>
  );
};

export default UserList;
