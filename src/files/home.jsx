import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
import { List, Bell } from 'react-bootstrap-icons';
import NotificationModal from '../subfiles/Notification';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [currentuser, setCurrentuser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], admins: [], assets: [] });
  const [assetData, setAssetData] = useState({ totalAssets: 0, borrowedAssets: 0, totalWorth: 0 });
  const [recentAssets, setRecentAssets] = useState([]);
  const [extensionRequests, setExtensionRequests] = useState([]);
  const [isSessionExpiredModalOpen, setIsSessionExpiredModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate()
  const handleshow = () => {
    setIsOpen(!isOpen);
  };

  const currentUser = localStorage.getItem('userRole');

  useEffect(() => {
    const userEmail = localStorage.getItem(currentUser === 'admin' ? 'adminemail' : 'useremail');
    if (userEmail) {
      axios.get(`/fetch${currentUser === 'admin' ? 'admin' : 'user'}info?email=${userEmail}`)
        .then((response) => {
          setCurrentuser(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user info', error);
          setIsLoading(false);
        });
    }
  }, [currentUser]);

  const closeNotificationModal = () => {
    setIsNotificationOpen(false);
  };

  const openNotificationModal = () => {
    setIsNotificationOpen(true);
  };

  const handleSearch = async () => {
    if (searchTerm.length < 4) return; // Minimum 4 characters required for search
    try {
      const response = await axios.get(`/search?term=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const clearSearchResults = () => {
    setSearchResults({ users: [], admins: [], assets: [] });
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length >= 4) {
      handleSearch();
    } else {
      clearSearchResults();
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      clearSearchResults();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  useEffect(() => {
    axios.get('/fetchassets')
      .then(response => {
        const { totalAssets, borrowedAssets, totalWorth } = response.data;
        setAssetData({ totalAssets, borrowedAssets, totalWorth });
      })
      .catch(error => {
        console.error('Error fetching asset data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('/recentassets')
      .then(response => {
        setRecentAssets(response.data);
      })
      .catch(error => {
        console.error('Error fetching recent assets:', error);
      });
  }, []);

  useEffect(() => {
      fetchExtensionRequests();
    // eslint-disable-next-line
  }, []);

  const openSessionExpiredModal = () => {
    setIsSessionExpiredModalOpen(true);
  };

  const closeSessionExpiredModal = () => {
    setIsSessionExpiredModalOpen(false);
  }

  useEffect(() => {
    // Check token expiration when the component mounts
    const token = localStorage.getItem(currentUser === 'admin' ? 'admintoken' : 'usertoken');
    if (token) {
      axios.post("/validateToken", { token })
        .then(response => {
          if (!response.data.valid) {
            openSessionExpiredModal();
          }
        })
        .catch(error => {
          console.error(error);
          // Handle error if validation request fails
        });
    } // eslint-disable-next-line
  }, []);

  
  function logout() {
    // Clear local storage
    localStorage.removeItem('userRole');
    localStorage.removeItem(currentUser === 'admin' ? 'adminemail' : 'useremail');
    localStorage.removeItem(currentUser === 'admin' ? 'admintoken' : 'usertoken');
    // Navigate to main or landing page
    navigate('/');
  }



  const fetchExtensionRequests = async () => {
    try {
      const response = await axios.get(`${currentUser === 'admin' ? '/adminnotifications' : '/notifications'}`);
      setExtensionRequests(response.data);
    } catch (error) {
      console.error('Error fetching extension requests:', error);
    }
  };

  const handleApprove = async (extensionId) => {
    try {
      await axios.put(`/extensions/approve/${extensionId}`);
      // Update extension request status locally and close sidebar
      setExtensionRequests(prevRequests =>
        prevRequests.map(request =>
          request.extensionId === extensionId ? { ...request, extensionStatus: 'approved' } : request
        )
      );
      closeNotificationModal();
      fetchExtensionRequests();
    } catch (error) {
      console.error('Error approving extension request:', error);
    }
  };

  const handleDecline = async (extensionId) => {
    try {
      await axios.put(`/extensions/decline/${extensionId}`);
      setExtensionRequests(prevRequests =>
        prevRequests.map(request =>
          request.extensionId === extensionId ? { ...request, extensionStatus: 'declined' } : request
        )
      );
      closeNotificationModal();
      fetchExtensionRequests();
    } catch (error) {
      console.error('Error declining extension request:', error);
    }
  };

  const handleAccept = async (assetId) => {
    try {
      await axios.put(`/request/accept/${assetId}`);
      // Update asset status locally to "borrowed"
      setExtensionRequests(prevRequests => 
        prevRequests.map(request => 
          request.assetId === assetId ? { ...request, assetStatus: 'borrowed' } : request
        )
      );
      closeNotificationModal();
      fetchExtensionRequests();
    } catch (error) {
      console.error('Error accepting asset request:', error);
    }
  };
  
  const handleRequestDecline = async (assetId) => {
    try {
      await axios.put(`/request/decline/${assetId}`);
      // Update asset status locally to "Declined"
      setExtensionRequests(prevRequests => 
        prevRequests.map(request => 
          request.assetId === assetId ? { ...request, assetStatus: 'Declined' } : request
        )
      );
      closeNotificationModal();
      fetchExtensionRequests();
    } catch (error) {
      console.error('Error declining asset request:', error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-4">
      <div className="w-full p-4">
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <List size={24} className='cursor-pointer w-10 h-10' onClick={handleshow}/>
            <h1 className="text-2xl font-semibold px-4">Welcome, {currentUser === 'admin' ? 'Admin' : 'User'}!</h1>
          </div>
          <div className='flex items-center gap-4 mr-4 relative'>
            {currentUser === 'admin' ?
            <div className='flex'>
             <Bell size={24} className='cursor-pointer' onClick={openNotificationModal} />
            {extensionRequests.length > 0 && (
              <div className="h-2 w-2 bg-red-500 rounded-full top-0 right-0 -ml-2.5"></div>
            )}
            </div>
            :
            <div className='flex'>
            <Bell size={24} className='cursor-pointer' onClick={openNotificationModal} />
           {extensionRequests.map((item)=> item.isReaded ? null :
             <div className="h-2 w-2 bg-red-500 rounded-full top-0 right-0 -ml-2.5"></div>
             )}
           </div>}
            <div className="flex items-center gap-2 relative" ref={dropdownRef}>
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 p-2 rounded-md pl-3 w-11/12"
                value={searchTerm}
                onChange={handleInputChange}
              />
              {Object.keys(searchResults).map((key) => (
                searchResults[key].length > 0 && (
                  <div key={key} className="absolute bg-white mt-28 p-2 rounded border border-gray-300 w-full max-h-64 overflow-y-auto">
                    {searchResults[key].map((result, index) => (
                      <div key={index} className="py-1">
                        {key === 'assets' ? (
                          <Link to={`/details/${result._id}`} className="text-blue-500 hover:underline">
                            {result.name}
                          </Link>
                        ) : (
                          <Link to={`/details/${result._id}`} className="text-blue-500 hover:underline">
                            {result.username}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
        {isLoading ? (
          <p>Loading user information...</p>
        ) : (
          <div className="flex flex-col sm:flex-row w-full gap-4">
            {currentuser ? (
              <div className="flex items-center bg-white rounded-lg shadow-md p-4 w-full sm:w-auto">
                <h1 className="font-semibold text-lg">{currentuser?.username}, {currentuser?.department}</h1>
              </div>
            ) : (
              <p className="w-full">User information not available.</p>
            )}
            <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-0 sm:space-x-3 sm:space-y-0">
              <div className="w-full sm:w-1/3 bg-blue-500 rounded-lg p-4 text-white shadow-md flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold mb-2">Total Assets</h2>
                <CountUp end={assetData.totalAssets} duration={2} className="font-bold text-lg" />
              </div>
              <div className="w-full sm:w-1/3 bg-yellow-500 rounded-lg p-4 text-white shadow-md flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold mb-2">Borrowed Assets</h2>
                <CountUp end={assetData.borrowedAssets} duration={2} className="font-bold text-lg" />
              </div>
              <div className="w-full sm:w-1/3 bg-green-500 rounded-lg p-4 text-white shadow-md flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold mb-2">Total Assets Worth</h2>
                <div className="flex items-center gap-1">
                  ₹<CountUp end={assetData.totalWorth} duration={2} className="font-bold text-lg" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='mt-10'>
          <h1>Recently Added Assets</h1>
          {recentAssets.length > 0 ? 
          <ul className='flex gap-3'>
          {recentAssets.map(asset => (
        <div key={asset._id} onClick={()=>navigate('/assets')} className="flex w-fit bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer">
          <div className="relative">
            {asset.picture && <img src={`data:image/jpeg;base64,${asset.picture}`} alt={asset.name} className="w-40 h-40 object-cover" />}
            <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1">{asset.name}</div>
          </div>
          <div className="p-4">
            <p className="text-gray-600">Asset name: <span className='font-semibold hover:text-gray-400 cursor-pointer'>{asset.name}</span></p>
            <p className="text-gray-600">Ref No: <span className='font-semibold hover:text-gray-400 cursor-pointer'>{asset.refNo}</span></p>
            <p className="text-gray-600">Date: <span className='font-semibold hover:text-gray-400 cursor-pointer'>{asset.date}</span></p>
            <p className="text-gray-600">status: <span className='font-semibold hover:text-gray-400 cursor-pointer'>{asset.status}</span></p>
            <p className="text-gray-600">Amount: ₹ <span className='font-semibold hover:text-gray-400 cursor-pointer'>{asset.amount}</span></p>
          </div>
        </div>
      ))}
          </ul>
          :<><p className='mt-3'>No recent asset added</p></>}
        </div>
      </div>
      {isOpen ? <Sidebar handleshow={handleshow} userRole={currentUser} /> : null}
      <NotificationModal 
       isOpen={isNotificationOpen}
       onClose={closeNotificationModal}
       currentUser={currentUser}
       handleApprove={handleApprove} 
       handleDecline={handleDecline}
       handleAccept={handleAccept}
       handleRequestDecline={handleRequestDecline}
       extensionRequests={extensionRequests}
       />
       {isSessionExpiredModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Session Expired</h2>
            <p className="mb-4">Your session has expired. Please login again to continue.</p>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                onClick={() => {
                  logout(); // Call logout function to clear session
                  closeSessionExpiredModal(); // Close the modal
                }}
              >
                Proceed to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
