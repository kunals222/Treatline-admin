import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUnverifiedDoctors, fetchDoctorByID, getVerifiedDoctors, verifyDoctor } from '../redux/adminSlice';
import Sidebar from './Sidebar';
import './Dashboard.css';
import DoctorProfile from './DoctorProfile';
import Statistics from './Statistics';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { unverifiedDoctors, verifiedDoctors, doctor, loading, error, token } = useSelector((state) => state.admin);
    const [view, setView] = useState('unverifiedDoctors');
    const [searchQuery, setSearchQuery] = useState('');
    const [previousView, setPreviousView] = useState(null); // Track the previous view


    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        if (view === 'unverifiedDoctors') {
            dispatch(getUnverifiedDoctors());
        } else if (view === 'verifiedDoctors') {
            dispatch(getVerifiedDoctors());
        }
    }, [dispatch, view]);

    const handleViewProfile = (doctorId, currentView) => {
        dispatch(fetchDoctorByID(doctorId));
        setPreviousView(currentView); // Set the current view as the previous view
        setView('doctorProfile');
    };

    const handleVerifyDoctor = (doctorId) => {
        dispatch(verifyDoctor(doctorId))
            .then(() => {
                alert('Doctor verified successfully!');
                dispatch(getUnverifiedDoctors());
                setView('unverifiedDoctors');
            })
            .catch(() => {
                alert('Failed to verify doctor. Please try again.');
            });
    };

    const filteredDoctors = (doctors) => {
        return doctors.filter((doctor) =>
            doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    return (
        <div className="dashboard-container">
            <Sidebar setToView={setView} />
            <main className="main-content">
                {view === 'unverifiedDoctors' && (
                    <>
                        <h2>Unverified Doctors</h2>
                        <input
                            type="text"
                            placeholder="Search by email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-bar"
                        />
                        {loading && <p>Loading...</p>}
                        {error && <p className="error">{error?.message}</p>}
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Specialist</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDoctors(unverifiedDoctors).map((doctor) => (
                                    <tr key={doctor._id}>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.email}</td>
                                        <td>{doctor.specialist}</td>
                                        <td>{doctor.is_active ? 'Verified' : 'Unverified'}</td>
                                        <td>
                                            {!doctor.is_active && (
                                                <button onClick={() => handleVerifyDoctor(doctor._id)}>Verify</button>
                                            )}
                                            <button onClick={() => handleViewProfile(doctor._id, 'unverifiedDoctors')}>View Profile</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
                {view === 'verifiedDoctors' && (
                    <>
                        <h2>Verified Doctors</h2>
                        <input
                            type="text"
                            placeholder="Search by email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-bar"
                        />
                        {loading && <p>Loading...</p>}
                        {error && <p className="error">{error?.message}</p>}
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Specialist</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDoctors(verifiedDoctors).map((doctor) => (
                                    <tr key={doctor._id}>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.email}</td>
                                        <td>{doctor.specialist}</td>
                                        <td>
                                            <button onClick={() => handleViewProfile(doctor._id, 'verifiedDoctors')}>View Profile</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
                {view === 'doctorProfile' && doctor && (
                    <DoctorProfile setToView={setView} previousView={previousView} />
                )}
                {view === 'statistics' && (
                    <Statistics />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
