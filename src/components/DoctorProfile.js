import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import './DoctorProfile.css';

const DoctorProfile = () => {
    const { doctor, loading, error } = useSelector((state) => state.admin);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="error">{error?.message}</p>;
    }

    if (!doctor) {
        return <p>Doctor not found</p>;
    }

    return (
        <div className="profile-container">
            <Sidebar />
            <main className="profile-content">
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
                <button>Verify</button>
            </main>
        </div>
    );
};

export default DoctorProfile;
