import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import { List } from 'react-bootstrap-icons';

export default function Employees() {
  const [users, setUsers] = useState([]);
  const currentUser = localStorage.getItem('userRole');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/employeedetails');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
      
  const handleShow = () =>{
    setIsOpen(!isOpen)
  }

  return (
    <div className="container px-4 mt-4">
      <div className="flex items-center gap-5 mb-4">
        <List
          size={24}
          className="cursor-pointer"
          onClick={handleShow}
        />
        <h1 className="text-2xl font-semibold">
          Employees
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            {user.profilePicture ? (
              <img
                src={`data:image/jpeg;base64,${user.profilePicture}`}
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4 object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
            )}
            <div className="flex flex-col">
              <span className="text-lg font-semibold mb-1">{user?.username}</span>
              <span className="text-sm text-gray-500 mb-1">{user?.email}</span>
              <span className="text-sm text-gray-500">{user?.department}</span>
            </div>
            <span
              className={`w-3 h-3 rounded-full ml-auto ${
                user.status === "online" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="text-xs ml-1">{user.status}</span>
          </div>
        ))}
      </div>
      {isOpen && <Sidebar handleShow={handleShow} userRole={currentUser} />}
    </div>
  );
}
