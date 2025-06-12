import React from 'react';
import "../Styles/Sidebar.css";

const Sidebar = ({ onTabChange, activeTab, handleLogout }) => {
  return (
    <div className="custom-sidebar">
      <h2 style={{ marginBottom: '2rem' }}>CollabNerds</h2>
      <div>
        <button
          onClick={() => onTabChange('projects')}
          style={activeTab === 'projects' ? styles.active : styles.button}
        >
          My Projects
        </button>
        <button
          onClick={() => onTabChange('meetings')}
          style={activeTab === 'meetings' ? styles.active : styles.button}
        >
          Schedule Meeting
        </button>
        <button
          onClick={() => onTabChange('chatbuddy')}
          style={activeTab === 'chatbuddy' ? styles.active : styles.button}
        >
          ChatBuddy 🤖
        </button>
        <button
          onClick={handleLogout}
          style={{
            ...styles.button,
            color: '#ff6666',
            fontWeight: 'bold',
            marginTop: '2rem',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  button: {
    display: 'block',
    width: '100%',
    background: 'transparent',
    border: 'none',
    color: '#ccc',
    padding: '0.8rem',
    textAlign: 'left',
    cursor: 'pointer',
    marginBottom: '0.5rem',
    transition: 'all 0.3s ease',
  },
  active: {
    display: 'block',
    width: '100%',
    background: '#333356',
    border: 'none',
    color: '#fff',
    padding: '0.8rem',
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
};

export default Sidebar;
