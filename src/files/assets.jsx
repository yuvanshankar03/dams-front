import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AssetItems from '../subfiles/assetsitems';
import Sidebar from './sidebar';
import { List } from 'react-bootstrap-icons';
import SearchUsers from '../subfiles/searchUser'; // Import the SearchUsers component
import BorrowedAssetItems from './borrowedAssets';

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [currentuser, setCurrentuser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refNo, setRefNo] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [picture, setPicture] = useState(null);
  const [date, setDate] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const currentUser = localStorage.getItem('userRole');
  const [assignSelectedUser, setAssignSelectedUser] = useState(null);
  const [assignBorrowedAt, setAssignBorrowedAt] = useState('');
  const [assignReturnWithin, setAssignReturnWithin] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetchAssets();
    fetchCurrentUser();// eslint-disable-next-line
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await axios.get('/assets');
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchCurrentUser = async () => {
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
  };

  const handleUpload = async () => {
    if (!refNo || !name || !picture || !date || !amount) {
      setUploadError('Please provide all required information.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('refNo', refNo);
      formData.append('name', name);
      formData.append('amount', amount);
      formData.append('picture', picture);
      formData.append('date', date);
      formData.append('department',currentuser?.department)
      await axios.post('/assets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadSuccess(true);
      setUploadError('');
      fetchAssets();
      window.location.reload();
    } catch (error) {
      setUploadError('Error uploading asset. Please try again.');
    }
  };

  const handlePictureChange = (event) => {
    setPicture(event.target.files[0]);
  };

  const handleshow = () => {
    setIsOpen(!isOpen);
  };

  const handleEdit = (asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
    setRefNo(asset.refNo);
    setName(asset.name);
    setAmount(asset.amount);
    setDate(asset.date);
  };

  const handleDelete = (asset) => {
    setSelectedAsset(asset);
    setDeleteConfirmationOpen(true);
  };

  const handleAssign = (asset) => {
    setSelectedAsset(asset);
    setAssignModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('refNo', refNo);
      formData.append('name', name);
      formData.append('amount', amount);
      formData.append('picture', picture);
      formData.append('date', date);
      formData.append('department',currentUser)

      await axios.put(`/editassets/${selectedAsset._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setModalOpen(false);
      fetchAssets();
    } catch (error) {
      console.error('Error updating asset:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/assets/${selectedAsset._id}`);
      setDeleteConfirmationOpen(false);
      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleAssignSave = async () => {
    try {
      // Make a POST request to assign the asset to the selected user
      await axios.post(`/${'assignAsset'}`, {
        assetId: selectedAsset._id,
        userId: assignSelectedUser._id,
        borrowedAt: assignBorrowedAt,
        returnWithin: assignReturnWithin,
      });
      setAssignModalOpen(false);
      window.location.reload()
      // Optionally, you can fetch the assets again to reflect the changes
      fetchAssets();
    } catch (error) {
      console.error('Error assigning asset:', error);
    }
  }


  

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex gap-3 items-center px-3 mt-2">
        <List
          size={24}
          className="mb-3.5 cursor-pointer"
          onClick={handleshow}
        />
        <h1 className="text-2xl font-semibold mb-4 px-4">Assets</h1>
      </div>
      {isLoading ? (
        <p>Loading user information...</p>
      ) : (
        <div className="flex justify-center h-fit gap-4">
          {currentuser ? (
            <div className="p-4">
              <p className="font-semibold text-lg">{currentuser?.username}, {currentuser?.department}</p>
            </div>
          ) : (
            <p>User information not available.</p>
          )}
        </div>
      )}
      <div className="container mx-auto px-4">
        {currentUser === 'admin' && (
          <>
            {uploadSuccess && (
              <div className="flex justify-between bg-green-200 text-green-700 px-4 py-2 rounded-md mb-4">
                Asset uploaded successfully!
                <span className="close cursor-pointer" onClick={()=>{setUploadSuccess(false)}}>&times;</span>
              </div>
            )}
            {uploadError && (
              <div className="flex justify-between bg-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
                {uploadError}
                <span className="close cursor-pointer" onClick={()=>{setUploadError(false)}}>&times;</span>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Upload New Asset</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Reference No." value={refNo} onChange={e => setRefNo(e.target.value)} className="border border-gray-300 p-2 rounded-md" />
                <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border border-gray-300 p-2 rounded-md" />
                <input type="file" accept="image/*" onChange={handlePictureChange} className="border border-gray-300 p-2 rounded-md" />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-gray-300 p-2 rounded-md" />
                <input type="text" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="border border-gray-300 p-2 rounded-md" />
              </div>
              <button onClick={handleUpload} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Upload</button>
            </div>
          </>
        )}
        <div className="">
        <p className='font-semibold underline mt-2 hover:text-gray-500 cursor-pointer'>Current Assets</p>
          <AssetItems
            currentUser={currentUser}
            assets={assets}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAssign={handleAssign}
          />
          <p className='font-semibold underline mt-2 hover:text-gray-500 cursor-pointer'>Borrowed Assets</p>
          <BorrowedAssetItems
           currentUser={currentUser}
           assets={assets}
          />
        </div>
        {isOpen ? <Sidebar handleshow={handleshow} userRole={currentUser} /> : null}
      </div>
      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="modal bg-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Edit Asset</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" value={refNo} onChange={e => setRefNo(e.target.value)} className="border border-gray-300 p-2 rounded-md mb-2" placeholder="Reference No." />
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="border border-gray-300 p-2 rounded-md mb-2" placeholder="Name" />
              <input type="file" accept="image/*" onChange={handlePictureChange} className="border border-gray-300 p-2 rounded-md mb-2" />
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-gray-300 p-2 rounded-md mb-2" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleSaveEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2">Save</button>
              <button onClick={() => setModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {deleteConfirmationOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="modal bg-white p-4 rounded-lg">
            <p>Are you sure you want to delete this asset?</p>
            <p>{selectedAsset.name}</p>
            <div className="flex justify-end mt-2">
              <button onClick={handleDeleteConfirm} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2">OK</button>
              <button onClick={() => setDeleteConfirmationOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {assignModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="modal bg-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Assign Asset</h2>
            <h3>{selectedAsset.name}</h3>
            <SearchUsers
              onSelect={(user) => setAssignSelectedUser(user)} // Pass a callback function to handle user selection
            />
            <input
              type="datetime-local"
              value={assignBorrowedAt}
              onChange={(e) => setAssignBorrowedAt(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mb-2"
            />
            <input
              type="datetime-local"
              value={assignReturnWithin}
              onChange={(e) => setAssignReturnWithin(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mb-2"
            /><br />
            <div className="flex justify-around">
              <button
                onClick={handleAssignSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
