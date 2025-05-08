import React from 'react';
import "../Styles/Sidebar.css"
const Sidebar = ({ onTabChange, activeTab }) => {
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
