import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentStatistics } from '../redux/adminSlice';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './Statistics.css';

const Statistics = () => {
    const dispatch = useDispatch();
    const { appointments : statistics, loading, error } = useSelector((state) => state.admin);
    const [filter, setFilter] = useState('all'); // Default filter
    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        // Fetch all data from the backend
        dispatch(fetchAppointmentStatistics());
    }, [dispatch]);

    useEffect(() => {
        if (statistics) {
            const now = new Date();
            let filteredAppointments = statistics;

            if (filter === '24hr') {
                const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                filteredAppointments = statistics.filter(
                    (appointment) => new Date(appointment.createdAt) >= startDate
                );
            } else if (filter === '7days') {
                const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredAppointments = statistics.filter(
                    (appointment) => new Date(appointment.createdAt) >= startDate
                );
            } else if (filter === 'month') {
                const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                filteredAppointments = statistics.filter(
                    (appointment) => new Date(appointment.createdAt) >= startDate
                );
            } else if (filter === 'year') {
                const startDate = new Date(now.getFullYear(), 0, 1);
                filteredAppointments = statistics.filter(
                    (appointment) => new Date(appointment.createdAt) >= startDate
                );
            }

            // Calculate statistics
            const calculatedStats = {
                total: filteredAppointments.length,
                scheduled: filteredAppointments.filter((app) => app.isScheduled).length,
                accepted: filteredAppointments.filter((app) => app.finalize_booking).length,
                rejected: filteredAppointments.filter(
                    (app) => !app.finalize_booking && app.isScheduled
                ).length,
            };

            setFilteredData(calculatedStats);
        }
    }, [statistics, filter]);

    const pieData = {
        labels: ['Scheduled', 'Accepted', 'Rejected'],
        datasets: [
            {
                data: [
                    filteredData?.scheduled || 0,
                    filteredData?.accepted || 0,
                    filteredData?.rejected || 0,
                ],
                backgroundColor: ['#36A2EB', '#4CAF50', '#FF6384'],
            },
        ],
    };

    const barData = {
        labels: ['Scheduled', 'Accepted', 'Rejected'],
        datasets: [
            {
                label: 'Appointments',
                data: [
                    filteredData?.scheduled || 0,
                    filteredData?.accepted || 0,
                    filteredData?.rejected || 0,
                ],
                backgroundColor: ['#36A2EB', '#4CAF50', '#FF6384'],
            },
        ],
    };

    return (
        <div className="statistics-container">
            <h2>Appointment Statistics</h2>
            <div className="filter-container">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All Time</option>
                    <option value="24hr">Past 24 Hours</option>
                    <option value="7days">Past 7 Days</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {filteredData && (
                <div className="charts-container">
                    <div className="chart">
                        <h3>Pie Chart</h3>
                        <Pie data={pieData} />
                    </div>
                    <div className="chart">
                        <h3>Bar Chart</h3>
                        <Bar data={barData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Statistics;