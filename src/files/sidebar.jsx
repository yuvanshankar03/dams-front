import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import axios from "axios";

const Sidebar = ({ userRole, handleshow }) => {

  const userEmail = localStorage.getItem(userRole === 'admin' ? 'adminemail' : 'useremail');
  const handleLogout = async () => {
    try {
      await axios.post('/logout', { email: userEmail, currentuser: userRole === 'admin' ? 'admin' : 'user' });
      localStorage.removeItem(userRole === 'admin' ? 'adminemail' : 'useremail');
      localStorage.removeItem('userRole')
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 lg:w-72 bg-gray-700 text-white shadow-lg">
      <div className="p-4 flex items-center justify-between">
        <ArrowLeft onClick={handleshow} className='cursor-pointer text-white' size={20} />
        <h2 className="text-lg font-semibold">Menu</h2>
      </div>
      <ul>
        <li className="px-4 py-3 border-b border-gray-800 hover:bg-gray-800">
          <Link to="/home" className="block">Home</Link>
        </li>
        <li className="px-4 py-3 border-b border-gray-800 hover:bg-gray-800">
          <Link to="/assets" className="block">Assets</Link>
        </li>
        {userRole === 'admin' && (
          <li className="px-4 py-3 border-b border-gray-800 hover:bg-gray-800">
            <Link to="/employees" className="block">Employees</Link>
          </li>
        )}
        <li className="px-4 py-3 border-b border-gray-800 hover:bg-gray-800">
          <Link to="/profile" className="block">Profile</Link>
        </li>
        <li className="px-4 py-3 border-b border-gray-800 hover:bg-gray-800">
          <Link to="/settings" className="block">Settings</Link>
        </li>
        <li className="px-4 py-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
