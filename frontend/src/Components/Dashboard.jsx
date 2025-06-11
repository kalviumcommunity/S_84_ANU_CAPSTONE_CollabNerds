import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MyProjects from './MyProjects';
import UpcomingMeetings from './UpcomingMeetings';
import "../Styles/Dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const renderContent = () => {
    if (activeTab === 'projects') return <MyProjects />;
    if (activeTab === 'meetings') return <UpcomingMeetings />;
    return null;  
  };

  return (
    <div className="dashboard-container">
      <Sidebar onTabChange={setActiveTab} activeTab={activeTab} />
      <div className="dashboard-main"> 
        <div className="projects-section">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
