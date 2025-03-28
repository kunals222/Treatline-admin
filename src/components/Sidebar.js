import React from 'react';
import './Sidebar.css';

const Sidebar = ({ setToView }) => {
    return (
        <aside className="sidebar">
            <h2>Admin Dashboard</h2>
            <nav>
                <ul>
                    <li><button onClick={() => setToView('unverifiedDoctors')}>Unverified Doctors</button></li>
                    <li><button onClick={() => setToView('verifiedDoctors')}>Verified Doctors</button></li>
                    <li><button onClick={() => setToView('statistics')}>Statistics</button></li>
                    <li><button onClick={() => setToView('logout')}>Logout</button></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
