import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookingHistory = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRides(response.data);
            } catch (error) {
                console.error("Error fetching history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [navigate]);

    return (
        <div className="container-fluid min-vh-100 bg-light p-0">
            {/* Header */}
            <div className="bg-dark text-white p-3 shadow-sm d-flex align-items-center">
                <i onClick={() => navigate(-1)} className="ri-arrow-left-line fs-4 me-3 cursor-pointer" style={{cursor: 'pointer'}}></i>
                <h4 className="mb-0">Your Rides</h4>
            </div>

            {/* List */}
            <div className="container mt-4">
                {loading ? (
                    <div className="d-flex justify-content-center mt-5">
                        <div className="spinner-border text-dark" role="status"></div>
                    </div>
                ) : rides.length === 0 ? (
                    <div className="text-center mt-5 text-muted">
                        <i className="ri-roadster-line display-1"></i>
                        <h4 className="mt-3">No past rides found</h4>
                        <p>Take a trip to see it here.</p>
                    </div>
                ) : (
                    <div className="row g-3">
                        {rides.map((ride, index) => (
                            <div key={index} className="col-12 col-md-6">
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                            <span className="badge bg-dark px-3 py-2">
                                                {new Date(ride.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className={`fw-bold text-${ride.status === 'completed' ? 'success' : 'warning'}`}>
                                                ${ride.fare || 0}
                                            </span>
                                        </div>
                                        
                                        <div className="d-flex align-items-start mb-3">
                                            <i className="ri-map-pin-user-fill text-dark me-2 fs-5 mt-1"></i>
                                            <div>
                                                <small className="text-muted d-block">Pickup</small>
                                                <span className="fw-medium">{ride.pickup}</span>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-start mb-2">
                                            <i className="ri-map-pin-2-fill text-dark me-2 fs-5 mt-1"></i>
                                            <div>
                                                <small className="text-muted d-block">Dropoff</small>
                                                <span className="fw-medium">{ride.destination}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer bg-white border-top-0 pt-0">
                                         <small className="text-muted">Vehicle: <span className="text-capitalize">{ride.vehicleType}</span></small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;
