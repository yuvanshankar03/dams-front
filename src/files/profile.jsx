import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import UserContext from './context';
import Sidebar from './sidebar';
import { List } from 'react-bootstrap-icons';


export default function Profile() {
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = localStorage.getItem('userRole');
  const fileInputRef = useRef(null); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewProfilePicture(file);
  };

  const handleUpload = async () => {
    try {
      const userEmail = localStorage.getItem(
        currentUser === "admin" ? "adminemail" : "useremail"
      );
      if (!userEmail) {
        console.error("User email not found.");
        return;
      }

      const formData = new FormData();
      formData.append('email', userEmail);
      formData.append('profilePicture', newProfilePicture);

      const response = await axios.post(`/uploadProfilePicture${currentUser === 'admin'?'/admin':'/user'}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Profile picture uploaded successfully:', response.data);
      // Refresh profile picture or update state as needed
      window.location.reload();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleCancel = () => {
    setNewProfilePicture(null);
    // Clear the file input by resetting its value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const userEmail = localStorage.getItem(currentUser === 'admin' ?'adminemail':'useremail');
    if (userEmail) {
      setEmail(userEmail);
      fetchUserProfile(userEmail); 
    }
  }, [currentUser]); // Fetch user profile when the user role changes

  const fetchUserProfile = async (userEmail) => {
    try {
      const response = await axios.get(`/${currentUser === 'admin' ? 'adminprofileinfo' : 'userprofileinfo'}?email=${userEmail}`);
      const { profilePicture, username } = response.data;
      setUserName(username)
      setProfilePicture(profilePicture);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleshow = () =>{
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <div className="flex gap-3 items-center px-3 mt-2">
        <List
          size={24}
          className="mb-3.5 cursor-pointer"
          onClick={handleshow}
        />
        <h1 className="text-2xl font-semibold mb-4 px-4">
          Profile
        </h1>
      </div>
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <div className="mb-4 flex items-center">
        <div>
          {profilePicture ? (
            <img src={`data:image/jpeg;base64,${profilePicture}`} alt="Profile" className="rounded-full w-24 h-24 object-cover" />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex justify-center items-center">
              <span className="text-gray-500 text-lg">No Image</span>
            </div>
          )}
          <input id="profilePicture" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{userName}</h2>
          <p className="text-gray-500">{email}</p>
          {!newProfilePicture && (
            <button onClick={handleProfileClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
              {profilePicture ? 'Edit Profile' : 'Upload Profile Picture'}
            </button>
          )}
        </div>
      </div>
      {newProfilePicture && (
        <div className="mt-4">
          <img src={URL.createObjectURL(newProfilePicture)} alt="Preview" className="w-24 h-24 object-cover rounded" />
          <div className="flex mt-2">
            <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Upload</button>
            <button onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
    {isOpen ? <Sidebar handleshow={handleshow} userRole={currentUser} /> : null}
    </div>
  );
}
