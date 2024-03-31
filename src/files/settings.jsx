import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import { List } from 'react-bootstrap-icons';


export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const currentUser = localStorage.getItem('userRole');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [ispasswordChecked,setIspasswordChecked] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const userEmail = localStorage.getItem(
    currentUser === "admin" ? "adminemail" : "useremail"
  );
  
  const fileInputRef = useRef(null);

  const handleShow = () => {
    setIsOpen(!isOpen);
  };

  const handleEditProfileClick = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleDeleteAccountClick = async () => {
    try {
      const response = await axios.delete(`/delete-user?email=${userEmail}`);
      console.log(response.data); 
      setIsDeleteAccountModalOpen(false)
      localStorage.removeItem(currentUser === 'admin' ? 'adminemail' : 'useremail');
      localStorage.removeItem('userRole')
      window.location.replace('/');      
    } catch (error) {
      console.error('Error deleting user:', error); 
    }
  };

  const handleCloseModals = () => {
    setIsEditProfileModalOpen(false);
    setIsChangePasswordModalOpen(false);
    setIsDeleteAccountModalOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewProfilePicture(file);
  };

  const handleUpload = async () => {
    try {
      if (!userEmail) {
        console.error("User email not found.");
        return;
      }

      const formData = new FormData();
      formData.append('email', userEmail);
      formData.append('profilePicture', newProfilePicture);

      const response = await axios.post(`uploadProfilePicture${currentUser === 'admin' ? '/admin' : '/user'}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Profile picture uploaded successfully:', response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleCancel = () => {
    setNewProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const userEmail = localStorage.getItem(currentUser === 'admin' ? 'adminemail' : 'useremail');
    if (userEmail) {
      setEmail(userEmail);
      fetchUserProfile(userEmail);
    }// eslint-disable-next-line
  }, [currentUser]);

  const fetchUserProfile = async (userEmail) => {
    try {
      const response = await axios.get(`${currentUser === 'admin' ? 'adminprofileinfo' : 'userprofileinfo'}?email=${userEmail}`);
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

  const handleChangePasswordcheck = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/check-password', {
        currentPassword,
      },{
        headers: {
          email: localStorage.getItem(currentUser === 'admin' ? 'adminemail' : 'useremail'),
        },
      });
      if(response.statusText === 'OK'){
        setIsChangePasswordModalOpen(false)
        setIspasswordChecked(true)
        setCurrentPassword('')
      }
    } catch (error) {
      console.error('Error checking current password:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleChangePasswordSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/update-account', {
        email,
        newPassword,
        newEmail
      });
      if(response.statusText === 'OK'){
        setIsChangePasswordModalOpen(false);
        setIspasswordChecked(false);
      }
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordClick = () =>{
    setIsChangePasswordModalOpen(true)
  }

  const handleDeleteAccount = () =>{
    setIsDeleteAccountModalOpen(true)
  }

  return (
    <>
      <div className="flex gap-3 items-center px-3 mt-2">
        <List
          size={24}
          className="mb-3.5 cursor-pointer"
          onClick={handleShow}
        />
        <h1 className="text-2xl font-semibold mb-4 px-4">Settings</h1>
      </div>
      {isOpen ? <Sidebar handleShow={handleShow} userRole={currentUser} /> : null}
      <div className="mt-4 px-12">
        <button onClick={handleEditProfileClick} className="block px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mb-2">Edit Profile</button>
        <button onClick={handleChangePasswordClick} className="block px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mb-2">Change Password/Email</button>
        <button onClick={handleDeleteAccount} className="block px-4 py-2 bg-white text-red-500 border border-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mb-2">Delete My Account</button>
      </div>
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-end">
              <button className="text-gray-600 hover:text-gray-800" onClick={handleCloseModals}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            {/* Add form fields for editing profile */}
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
          </div>
        </div>
      )}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Change Password/Email</h2>
            <input
              type="password"
              placeholder="Current Password"
              className="block w-full border-gray-300 rounded-md shadow-sm mb-4 p-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={handleChangePasswordcheck}
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Submit'}
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ml-2"
                onClick={handleCloseModals}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {ispasswordChecked && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Change Password/Email</h2>
            <input type="email" placeholder="New Email (Optional)" className="block w-full border-gray-300 rounded-md shadow-sm mb-4 p-2" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <input type="password" placeholder="New Password" className="block w-full border-gray-300 rounded-md shadow-sm mb-4 p-2" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm New Password" className="block w-full border-gray-300 rounded-md shadow-sm mb-4 p-2" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={handleChangePasswordSubmit} disabled={loading}>
                {loading ? 'Updating...' : 'Submit'}
              </button>
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ml-2" onClick={() => { setIspasswordChecked(false); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {isDeleteAccountModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-end">
              <button className="text-gray-600 hover:text-gray-800" onClick={handleCloseModals}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Delete Account</h2>
            <p className="mb-4">Are you sure you want to delete your account?</p>
            <div className="flex justify-end">
              <button className="px-4 py-2 mr-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleDeleteAccountClick}>Delete</button>
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" onClick={handleCloseModals}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
