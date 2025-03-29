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
            <div className="sidebar-footer">
                © 2023 TreatLine Admin
            </div>
        </aside>
    );
};

export default Sidebar;
