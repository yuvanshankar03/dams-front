import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import DepartmentSelector from '../subfiles/departmentselection';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${isAdmin ? '/adminregister' : '/register'}`, {
        username,
        email,
        password,
        department,
        adminSecretInput: isAdmin ? adminSecret : undefined
      });
      localStorage.setItem('userRole',isAdmin ? 'admin' : 'user')
      localStorage.setItem(isAdmin?'adminemail':'useremail', email);
      localStorage.setItem(isAdmin ? 'admintoken':'usertoken',response.data.token)
      navigate('/home');
    } catch (error) {
      setError(error.response.data.error || error.response.data.message);
      console.error('Registration error:', error.response.data.error);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Registration</h2>
        <form onSubmit={handleRegistration}>
          <div className='grid grid-cols-12 gap-2'>
          <input
            type="text"
            placeholder="Username"
            className="mb-2 p-2 border rounded w-full col-span-9"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="inline-flex items-center mb-2 col-span-3">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            onChange={() => setIsAdmin(!isAdmin)}
          />
          <span className="ml-2 text-gray-700">Admin</span>
        </label>
        </div>
          <input
            type="email"
            required
            placeholder="Email"
            className="mb-2 p-2 border rounded w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          {isAdmin ? 
          <input
            type="text"
            required
            placeholder="Admin Secrect"
            className="mb-2 p-2 border rounded w-full"
            onChange={(e) => setAdminSecret(e.target.value)}
          />:null}
          <input
            type="password"
            required
            placeholder="Password"
            className="mb-2 p-2 border rounded w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <DepartmentSelector isAdmin={isAdmin} onSelectDepartment={setDepartment} />
        <br />
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
          {error && <div className="mt-4 text-red-500">{error}</div>}
        </form>
        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
