import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, captains: 0, rides: 0, revenue: 0, tickets: 0 });
    const [users, setUsers] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin-login');
                return;
            }

            try {
                const [statsRes, usersRes, ticketsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BASE_URL}/admins/stats`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${import.meta.env.VITE_BASE_URL}/admins/all-users`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${import.meta.env.VITE_BASE_URL}/support/all-tickets`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setStats(statsRes.data);
                setUsers(usersRes.data);
                setTickets(ticketsRes.data);
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin-login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;

    return (
        <div className="container-fluid bg-light min-vh-100 p-0">
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-dark px-4 py-3 shadow-sm">
                <span className="navbar-brand mb-0 h1">UCab Control Center</span>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">Logout Admin</button>
            </nav>

            <div className="container mt-4">
                <h3 className="mb-4 text-secondary">Dashboard Overview</h3>
                
                {/* Stats Cards */}
                <div className="row g-4 mb-5">
                    <div className="col-md-2">
                        <div className="card text-white bg-primary p-3 shadow-sm border-0">
                            <h5>Users</h5>
                            <h2>{stats.users}</h2>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="card text-white bg-success p-3 shadow-sm border-0">
                            <h5>Captains</h5>
                            <h2>{stats.captains}</h2>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="card text-dark bg-warning p-3 shadow-sm border-0">
                            <h5>Rides</h5>
                            <h2>{stats.rides}</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-info p-3 shadow-sm border-0">
                            <h5>Est. Revenue</h5>
                            <h2>${stats.revenue.toFixed(2)}</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-danger p-3 shadow-sm border-0">
                            <h5>Support Tickets</h5>
                            <h2>{stats.tickets}</h2>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-white py-3">
                        <h5 className="mb-0">Registered Users</h5>
                    </div>
                    <div className="card-body p-0 table-responsive">
                        <table className="table table-hover mb-0 text-sm">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user._id.substring(0, 8)}...</td>
                                        <td>{user.fullname?.firstname} {user.fullname?.lastname}</td>
                                        <td>{user.email}</td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan="3" className="text-center py-3 text-muted">No users found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tickets Table */}
                <div className="card shadow-sm border-0 mb-5">
                    <div className="card-header bg-white py-3">
                        <h5 className="mb-0">Support Tickets</h5>
                    </div>
                    <div className="card-body p-0 table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Subject</th>
                                    <th>Description</th>
                                    <th>User</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map(ticket => (
                                    <tr key={ticket._id}>
                                        <td><span className="badge bg-secondary text-capitalize">{ticket.subject}</span></td>
                                        <td>{ticket.description}</td>
                                        <td>{ticket.user?.email || 'Guest'}</td>
                                        <td>
                                            <span className={`badge ${ticket.status === 'open' ? 'bg-danger' : 'bg-success'}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {tickets.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-3 text-muted">No tickets found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
