import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {

  const navigate = useNavigate()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')

  const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')


  const { captain, setCaptain } = React.useContext(CaptainDataContext)


  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

        if (response.status === 201) {
            const data = response.data
            setCaptain(data.captain)
            localStorage.setItem('token', data.token)
            navigate('/captain-home')
        }
    } catch (error) {
        console.error("Signup error", error);
        alert(error.response?.data?.message || "Registration failed. Check your data.");
    } finally {
        setEmail('')
        setFirstName('')
        setLastName('')
        setPassword('')
        setVehicleColor('')
        setVehiclePlate('')
        setVehicleCapacity('')
        setVehicleType('')
    }

  }
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-y-auto py-12'>
      {/* Background decoration */}
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full'></div>
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-600/10 blur-[120px] rounded-full'></div>

      <div className='max-w-2xl w-full mx-4 z-10'>
        <div className='text-center mb-8'>
          <Link to='/' className='text-3xl font-bold tracking-tighter inline-flex items-center gap-2'>
            <span className='bg-[#FFB800] text-black px-2 py-0.5 rounded-lg text-2xl'>U</span>
            <span className='text-white'>Cab</span>
          </Link>
        </div>

        <div className='glass-dark p-8 md:p-10 rounded-2xl shadow-2xl border-slate-700/50'>
          <h2 className='text-2xl font-bold text-white mb-2'>Captain Registration</h2>
          <p className='text-slate-400 mb-8'>Join our elite fleet of professional captains</p>

          <form onSubmit={submitHandler} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-slate-300 mb-1'>First Name</label>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-[#FFB800] focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-slate-600'
                  type="text"
                  placeholder='John'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-slate-300 mb-1'>Last Name</label>
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-[#FFB800] focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-slate-600'
                  type="text"
                  placeholder='Doe'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-slate-300 mb-1'>Email Address</label>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-[#FFB800] focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-slate-600'
                  type="email"
                  placeholder='name@ucab.com'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-slate-300 mb-1'>Password</label>
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-[#FFB800] focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-slate-600'
                  type="password"
                  placeholder='••••••••'
                />
              </div>
            </div>

            <div className='pt-2'>
              <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4'>Vehicle Details</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div>
                  <label className='block text-xs font-medium text-slate-400 mb-1'>Color</label>
                  <input
                    required
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                    className='w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:border-[#FFB800] outline-none transition-all'
                    type="text"
                    placeholder='Black'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-slate-400 mb-1'>Plate</label>
                  <input
                    required
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className='w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:border-[#FFB800] outline-none transition-all'
                    type="text"
                    placeholder='ABC-123'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-slate-400 mb-1'>Capacity</label>
                  <input
                    required
                    value={vehicleCapacity}
                    onChange={(e) => setVehicleCapacity(e.target.value)}
                    className='w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:border-[#FFB800] outline-none transition-all'
                    type="number"
                    placeholder='4'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-slate-400 mb-1'>Type</label>
                  <select
                    required
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className='w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:border-[#FFB800] outline-none transition-all'
                  >
                    <option value="" disabled>Type</option>
                    <option value="car">Car</option>
                    <option value="auto">Auto</option>
                    <option value="moto">Moto</option>
                  </select>
                </div>
              </div>
            </div>

            <button className='btn-primary-ucab w-full text-lg mt-4'>
              Register as Captain
            </button>
          </form>

          <div className='mt-8 pt-6 border-t border-slate-700/50 text-center'>
            <p className='text-slate-400'>
              Already a captain? <Link to='/captain-login' className='text-[#FFB800] font-semibold hover:underline'>Log in</Link>
            </p>
          </div>
        </div>

        <p className='mt-6 text-center text-[10px] text-slate-500 leading-tight'>
          This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span>.
        </p>
      </div>
    </div>
  )
}

export default CaptainSignup