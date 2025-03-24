import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css'; // Import the CSS file

function Dashboard() {
    return (
        <main>
            <h2>Dashboard</h2>
            <div className="dashboard-links">
                <Link to="/students">Manage Students</Link>
                <Link to="/teachers">Manage Teachers</Link>
                <Link to="/classes">Manage Classes</Link>
                <Link to="/attendance">Track Attendance</Link>
                <Link to="/grades">Manage Grades</Link>
            </div>
            <div className="image-container">
                <img src="C:\Users\VictorJoseph\Downloads\download.png" alt="Kids happily reading in the library" />
            </div>
        </main>
    );
}

export default Dashboard;
