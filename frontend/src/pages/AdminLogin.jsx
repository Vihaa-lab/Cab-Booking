import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admins/login`, {
        email,
        password
      });

      if (response.status === 200) {
        const data = response.data;
        setUser(data.admin);
        localStorage.setItem('adminToken', data.token);
        navigate('/admin-dashboard');
      }
    } catch (error) {
       alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='p-7 h-screen flex flex-col justify-center bg-light'>
      <div className='bg-white p-5 rounded shadow-sm max-w-md mx-auto w-full'>
        <h2 className='text-center mb-4 font-bold text-dark'>Admin Portal Login</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label className='form-label font-medium'>Admin Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='form-control bg-light border-0'
              type="email"
              placeholder='admin@ucab.com'
            />
          </div>
          <div className="mb-4">
            <label className='form-label font-medium'>Password</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='form-control bg-light border-0'
              type="password"
              placeholder='password'
            />
          </div>
          <button className='btn btn-dark w-100 py-2 font-semibold'>Login to Dashboard</button>
        </form>
        <div className="text-center mt-3">
          <Link to='/login' className='text-secondary text-decoration-none'>Go back to User Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
