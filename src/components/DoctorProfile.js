import React from 'react';
import { useSelector } from 'react-redux';
import './DoctorProfile1.css';

const DoctorProfile = ({ setToView, previousView }) => {
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

    // Function to render stars based on the rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? 'star filled' : 'star'}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="profile-container">
            <button className="back-button" onClick={() => setToView(previousView)}>
                ←
            </button>
            <main className="profile-content">
            
                <div className="profile-header">
                    <img src={doctor.profile_image} alt={`${doctor.name}'s profile`} className="profile-image" />
                    <div className="profile-basic-details">
                        <h2>{doctor.name}</h2>
                        <p><strong>Email:</strong> {doctor.email}</p>
                        <div className="rating">{renderStars(Math.round(doctor.rating))}</div>
                    </div>
                </div>
                <div className="profile-details-table">
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>Specialist:</strong></td>
                                <td>{doctor.specialist}</td>
                            </tr>
                            <tr>
                                <td><strong>Specialist Degree:</strong></td>
                                <td>{doctor.specialistDegree}</td>
                            </tr>
                            <tr>
                                <td><strong>Experience:</strong></td>
                                <td>{doctor.years_of_experience} years</td>
                            </tr>
                            <tr>
                                <td><strong>Phone:</strong></td>
                                <td>{doctor.phone}</td>
                            </tr>
                            <tr>
                                <td><strong>Medical Registration ID:</strong></td>
                                <td>{doctor.medical_registration_id}</td>
                            </tr>
                            <tr>
                                <td><strong>Medical License:</strong></td>
                                <td>
                                    <a href={doctor.medical_license} target="_blank" rel="noopener noreferrer">
                                        View License
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Address:</strong></td>
                                <td>{doctor.address || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>Languages:</strong></td>
                                <td>{doctor.language.join(', ')}</td>
                            </tr>
                            <tr>
                                <td><strong>Sponsored:</strong></td>
                                <td>{doctor.sponsored ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                                <td><strong>Rating Count:</strong></td>
                                <td>{doctor.rating_count - 1}</td>
                            </tr>
                        </tbody>
                    </table>
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
