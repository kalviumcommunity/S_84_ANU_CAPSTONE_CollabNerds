import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MyProjects from './MyProjects';
import UpcomingMeetings from './UpcomingMeetings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const renderContent = () => {
    if (activeTab === 'projects') return <MyProjects />;
    if (activeTab === 'meetings') return <UpcomingMeetings />;
    return null;
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onTabChange={setActiveTab} activeTab={activeTab} />
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;