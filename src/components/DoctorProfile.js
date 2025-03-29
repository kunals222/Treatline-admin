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
                <div className="profile-header">
                    <img src={doctor.profile_image} alt={`${doctor.name}'s profile`} className="profile-image" />
                    <div className="profile-details">
                        <h2>{doctor.name}</h2>
                        <p><strong>Email:</strong> {doctor.email}</p>
                        <p><strong>Specialist:</strong> {doctor.specialist}</p>
                        <p><strong>Experience:</strong> {doctor.years_of_experience} years</p>
                        <p><strong>Phone:</strong> {doctor.phone}</p>
                        <p><strong>Medical Registration ID:</strong> {doctor.medical_registration_id}</p>
                        <p>
                            <strong>Medical License:</strong>{' '}
                            <a href={doctor.medical_license} target="_blank" rel="noopener noreferrer">
                                View License
                            </a>
                        </p>
                    </div>
                </div>
                <div className="certificates-section">
                    <h4>Certificates:</h4>
                    <div className="certificates-container">
                        {doctor.certificates.map((certificate, index) => (
                            <div key={index} className="certificate-preview">
                                <embed src={certificate} type="application/pdf" className="certificate-embed" />
                                <p>Certificate {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorProfile;
