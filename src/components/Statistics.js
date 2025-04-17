import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentStatistics } from '../redux/adminSlice';
import { Pie, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './Statistics.css';

const Statistics = () => {
    const dispatch = useDispatch();
    const { appointments: statistics, loading, error } = useSelector((state) => state.admin);
    const [filter, setFilter] = useState('all'); // Default filter
    const [specificDate, setSpecificDate] = useState(''); // For day, month, or year filter
    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        // Fetch all data from the backend
        dispatch(fetchAppointmentStatistics());
    }, [dispatch]);

    useEffect(() => {
        if (statistics) {
            let filteredAppointments = statistics;

            if (filter === 'day' && specificDate) {
                filteredAppointments = statistics.filter(
                    (appointment) =>
                        new Date(appointment.createdAt).toISOString().split('T')[0] === specificDate
                );
            } else if (filter === 'month' && specificDate) {
                const [year, month] = specificDate.split('-');
                filteredAppointments = statistics.filter((appointment) => {
                    const appointmentDate = new Date(appointment.createdAt);
                    return (
                        appointmentDate.getFullYear() === parseInt(year, 10) &&
                        appointmentDate.getMonth() + 1 === parseInt(month, 10)
                    );
                });
            } else if (filter === 'year' && specificDate) {
                filteredAppointments = statistics.filter(
                    (appointment) =>
                        new Date(appointment.createdAt).getFullYear() === parseInt(specificDate, 10)
                );
            }

            // Group timeline data by day
            const timelineData = filteredAppointments.reduce((acc, app) => {
                const day = new Date(app.createdAt).toISOString().split('T')[0]; // Group by day
                if (!acc[day]) {
                    acc[day] = { accepted: 0, rejected: 0 };
                }
                if (app.finalize_booking) {
                    acc[day].accepted += 1;
                } else if (!app.finalize_booking && app.isScheduled) {
                    acc[day].rejected += 1;
                }
                return acc;
            }, {});

            // Get the earliest and latest dates
            const days = Object.keys(timelineData).sort();
            const startDate = new Date(days[0]);
            startDate.setDate(startDate.getDate() - 1); // Start one day before the earliest date
            const endDate = new Date(days[days.length - 1]);

            // Generate all dates between startDate and endDate
            const allDates = [];
            let currentDate = startDate;
            while (currentDate <= endDate) {
                const formattedDate = currentDate.toISOString().split('T')[0];
                allDates.push({
                    day: formattedDate,
                    accepted: timelineData[formattedDate]?.accepted || 0,
                    rejected: timelineData[formattedDate]?.rejected || 0,
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Calculate statistics
            const calculatedStats = {
                total: filteredAppointments.length,
                accepted: filteredAppointments.filter((app) => app.finalize_booking).length,
                rejected: filteredAppointments.filter(
                    (app) => !app.finalize_booking && app.isScheduled
                ).length,
                timeline: allDates,
            };

            setFilteredData(calculatedStats);
        }
    }, [statistics, filter, specificDate]);

    const pieData = {
        labels: ['Accepted', 'Rejected'],
        datasets: [
            {
                data: [
                    filteredData?.accepted || 0,
                    filteredData?.rejected || 0,
                ],
                backgroundColor: ['#4CAF50', '#FF6384'],
            },
        ],
    };

    const barData = {
        labels: ['Accepted', 'Rejected'],
        datasets: [
            {
                label: 'Appointments',
                data: [
                    filteredData?.accepted || 0,
                    filteredData?.rejected || 0,
                ],
                backgroundColor: ['#4CAF50', '#FF6384'],
            },
        ],
    };

    const lineData = {
        labels: filteredData?.timeline.map((entry) => entry.day) || [],
        datasets: [
            {
                label: 'Accepted',
                data: filteredData?.timeline.map((entry) => entry.accepted) || [],
                borderColor: '#4CAF50', // Green line for accepted
                fill: false,
                tension: 0.1,
            },
            {
                label: 'Rejected',
                data: filteredData?.timeline.map((entry) => entry.rejected) || [],
                borderColor: '#FF6384', // Red line for rejected
                fill: false,
                tension: 0.3,
            },
        ],
    };

    return (
        <div className="statistics-container">
            <h2>Appointment Statistics</h2>
            <div className="filter-container">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All Time</option>
                    <option value="day">Specific Day</option>
                    <option value="month">Specific Month</option>
                    <option value="year">Specific Year</option>
                </select>
                {(filter === 'day' || filter === 'month' || filter === 'year') && (
                    <input
                        type={filter === 'day' ? 'date' : filter === 'month' ? 'month' : 'number'}
                        value={specificDate}
                        onChange={(e) => setSpecificDate(e.target.value)}
                        placeholder={
                            filter === 'year' ? 'Enter Year (e.g., 2025)' : undefined
                        }
                    />
                )}
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {filteredData && (
                <>
                    {/* Boxes for appointment counts */}
                    <div className="stats-boxes">
                        <div className="stats-box">
                            <h4>Scheduled Appointments</h4>
                            <p>{filteredData?.total || 0}</p>
                        </div>
                        <div className="stats-box">
                            <h4>Accepted Appointments</h4>
                            <p>{filteredData?.accepted || 0}</p>
                        </div>
                        <div className="stats-box">
                            <h4>Rejected Appointments</h4>
                            <p>{filteredData?.rejected || 0}</p>
                        </div>
                    </div>

                    <div className="charts-container">
                        <div className="chart">
                            <h3>Appointment Distribution</h3>
                            <Pie data={pieData} />
                        </div>
                        <div className="chart">
                            <h3>Appointment Comparison</h3>
                            <Bar data={barData} />
                        </div>
                    </div>
                    <div className="line-chart-container">
                        <h3>Daily Appointment Trends</h3>
                        <Line data={lineData} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Statistics;