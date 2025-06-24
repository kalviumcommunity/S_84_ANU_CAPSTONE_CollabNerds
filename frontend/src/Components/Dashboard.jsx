import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MyProjects from './MyProjects';
import UpcomingMeetings from './UpcomingMeetings';
import ChatBuddy from './ChatBuddy';
import "../Styles/Dashboard.css";
import { auth } from '../firebase'; 

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return <MyProjects />;
      case 'meetings':
        return <UpcomingMeetings />;
      case 'chatbuddy':
        return <ChatBuddy />;
      default:
        return null;
    }
  };

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  auth.signOut(); // 🔐 Sign out from Firebase (Google Sign-In)
  window.location.href = '/login';
};
  return (
    <div className="dashboard-container">
      <Sidebar onTabChange={setActiveTab} activeTab={activeTab} handleLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="projects-section">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
