import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Support = () => {
    const navigate = useNavigate();
    const [ticketState, setTicketState] = useState('idle'); // idle, sending, success
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTicketState('sending');
        
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_BASE_URL}/support/create-ticket`, {
                subject,
                description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTicketState('success');
            setTimeout(() => {
                setTicketState('idle');
                setSubject('');
                setDescription('');
            }, 3000);
        } catch (error) {
            console.error("Error submitting ticket", error);
            alert("Failed to submit ticket. Please try again.");
            setTicketState('idle');
        }
    };

    return (
        <div className="container-fluid min-vh-100 bg-light p-0">
            {/* Header */}
            <div className="bg-dark text-white p-3 shadow-sm d-flex align-items-center mb-4">
                <i onClick={() => navigate(-1)} className="ri-arrow-left-line fs-4 me-3 cursor-pointer" style={{ cursor: 'pointer' }}></i>
                <h4 className="mb-0">Help & Support</h4>
            </div>

            <div className="container pb-5">
                <div className="row g-4">
                    {/* FAQ Section */}
                    <div className="col-md-6">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header bg-white py-3">
                                <h5 className="mb-0 fw-bold"><i className="ri-question-answer-fill text-primary me-2"></i>Frequently Asked Questions</h5>
                            </div>
                            <div className="card-body">
                                <div className="accordion accordion-flush" id="faqAccordion">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed fw-medium" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                                How do I reset my password?
                                            </button>
                                        </h2>
                                        <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                            <div className="accordion-body text-muted">Go strictly to the profile section and click 'Forgot Password'.</div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed fw-medium" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                                How is the fare calculated?
                                            </button>
                                        </h2>
                                        <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                            <div className="accordion-body text-muted">Fare is calculated using our backend routing API which multiplies base rate by distance out of OSRM.</div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed fw-medium" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                                Can I cancel my ride?
                                            </button>
                                        </h2>
                                        <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                            <div className="accordion-body text-muted">You can cancel your ride before the captain accepts it without any penalty.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Us Form */}
                    <div className="col-md-6">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header bg-white py-3">
                                <h5 className="mb-0 fw-bold"><i className="ri-mail-send-fill text-success me-2"></i>Contact Support</h5>
                            </div>
                            <div className="card-body">
                                {ticketState === 'success' ? (
                                    <div className="alert alert-success d-flex align-items-center h-100">
                                        <div>
                                            <i className="ri-checkbox-circle-fill fs-3 me-2"></i>
                                            Your support ticket has been submitted. We will email you shortly!
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Issue Subject</label>
                                            <select 
                                                className="form-select bg-light border-0" 
                                                required
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                            >
                                                <option value="">Select an issue type...</option>
                                                <option value="payment">Payment Problem</option>
                                                <option value="driver">Report a Captain</option>
                                                <option value="app">App crashing/Bugs</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-medium">Description</label>
                                            <textarea 
                                                className="form-control bg-light border-0" 
                                                rows="4" 
                                                placeholder="Explain your issue in detail..." 
                                                required
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="btn btn-dark w-100 fw-bold py-2"
                                            disabled={ticketState === 'sending'}
                                        >
                                            {ticketState === 'sending' ? 'Submitting...' : 'Submit Ticket'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
