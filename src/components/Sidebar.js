import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/adminSlice';
import logo from '../logo1.png';
import './Sidebar.css';

const Sidebar = ({ setToView }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="brand-container">
                <div className="brand-logo">
                    <img src={logo} alt="TreatLine Logo" />
                </div>
                <span className="brand-name">TreatLine</span>
            </div>
            <aside className="sidebar">
                <h2>Admin Dashboard</h2>
                <nav>
                    <ul>
                        <li><button onClick={() => setToView('unverifiedDoctors')}>Unverified Doctors</button></li>
                        <li><button onClick={() => setToView('verifiedDoctors')}>Verified Doctors</button></li>
                        <li><button onClick={() => setToView('statistics')}>Statistics</button></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </ul>
                </nav>
            </aside>
        </div>
    );
};

export default Sidebar;
