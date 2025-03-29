import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUnverifiedDoctors, fetchDoctorByID, getVerifiedDoctors, verifyDoctor } from '../redux/adminSlice';
import Sidebar from './Sidebar';
import './Dashboard.css';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { unverifiedDoctors, verifiedDoctors, doctor, loading, error , token } = useSelector((state) => state.admin);
    const [view, setView] = useState('unverifiedDoctors');
    const [searchQuery, setSearchQuery] = useState('');

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
    }, [dispatch, view, navigate]);

    const handleViewProfile = (doctorId) => {
        dispatch(fetchDoctorByID(doctorId));
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
                                            <button onClick={() => handleViewProfile(doctor._id)}>View Profile</button>
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
                                            <button onClick={() => handleViewProfile(doctor._id)}>View Profile</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
                {view === 'doctorProfile' && doctor && (
                    <>
                        <h2>{doctor.name}</h2>
                        <p>Email: {doctor.email}</p>
                        <p>Specialist: {doctor.specialist}</p>
                        <p>Experience: {doctor.years_of_experience} years</p>
                        <p>Phone: {doctor.phone}</p>
                        <p>Medical Registration ID: {doctor.medical_registration_id}</p>
                        <img src={doctor.profile_image} alt={`${doctor.name}'s profile`} width="100" />
                        <p>Medical License: <a href={doctor.medical_license} target="_blank" rel="noopener noreferrer">View License</a></p>
                        <h4>Certificates:</h4>
                        <ul>
                            {doctor.certificates.map((certificate, index) => (
                                <li key={index}>
                                    <a href={certificate} target="_blank" rel="noopener noreferrer">View Certificate {index + 1}</a>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setView('unverifiedDoctors')}>Back</button>
                    </>
                )}
                {view === 'statistics' && (
                    <>
                        <h2>Statistics</h2>
                        <p>Statistics content will be displayed here.</p>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
