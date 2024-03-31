import React from 'react';
import { useState } from 'react';
import { PencilSquare, Trash, PersonPlus } from 'react-bootstrap-icons';
import axios from 'axios';

export default function AssetItems({ assets, onEdit, onDelete, onAssign, currentUser }) {

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [assignBorrowedAt, setAssignBorrowedAt] = useState('');
  const [assignReturnWithin, setAssignReturnWithin] = useState('');
  const userEmail = localStorage.getItem(currentUser === 'admin' ? 'adminemail' : 'useremail');
  

  const handleEdit = (asset) => {
    onEdit(asset);
  };

  const handleDelete = (asset) => {
    onDelete(asset);
  };

  const handleAssign = (asset) => {
    onAssign(asset);
  };

  const handleRequest = (asset) =>{
    setSelectedAsset(asset);
    setBorrowModalOpen(true);
  }

  const handleBorrowSave = async () => {
    try {
      // Make a POST request to assign the asset to the selected user
      await axios.post(`/${'borrowAsset'}`, {
        assetId: selectedAsset._id,
        email: userEmail,
        assetName:selectedAsset.name,
        borrowedAt: assignBorrowedAt,
        returnWithin: assignReturnWithin,
      });
      setBorrowModalOpen(false);
      window.location.reload()
    } catch (error) {
      console.error('Error assigning asset:', error);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {assets.map(asset => (
        <div key={asset._id} className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition duration-300">
          <div className="relative">
            {asset.picture && <img src={`data:image/jpeg;base64,${asset.picture}`} alt={asset.name} className="w-full h-40 object-cover" />}
            <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1">{asset.name}</div>
            {currentUser === 'admin' ?
            <div className="absolute top-0 right-0 flex items-center justify-center">
              <button className="mr-2" onClick={() => handleEdit(asset)}>
                <PencilSquare size={20} color='black'/>
              </button>
              <button className="mr-2" onClick={() => handleDelete(asset)}>
                <Trash size={20}  color='black'/>
              </button>
              <button onClick={() => handleAssign(asset)}>
                <PersonPlus size={20}  color='black'/>
              </button>
            </div> :  null}
          </div>
          <div className="p-4">
            <p className="text-gray-600">Asset name: <span className='font-semibold hover:text-gray-400 cursor-pointer'>{asset.name}</span></p>
            <p className="text-gray-600">Ref No: <span className='font-semibold hover:text-gray-400 cursor-pointer'>{asset.refNo}</span></p>
            <p className="text-gray-600">Date: <span className='font-semibold hover:text-gray-400 cursor-pointer'>{asset.date}</span></p>
            <p className="text-gray-600">status: <span className='font-semibold hover:text-gray-400 cursor-pointer'>{asset.status}</span></p>
            <p className="text-gray-600">Amount: ₹ <span className='font-semibold hover:text-gray-400 cursor-pointer'>{asset.amount}</span></p>
          {asset.status !== 'borrowed' && 'Requested'?
          <div className="mt-3">
              <button onClick={()=>handleRequest(asset)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2">Borrow this asset</button>
            </div>
           : null }
        </div>
        </div>
      ))}
      {borrowModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="modal bg-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Borrow Asset</h2>
            <p className="text-gray-600 p-1">Asset name: <span className='font-semibold hover:text-gray-400 cursor-pointer'>{selectedAsset.name}</span></p>
            <div className='flex'>
            <div className='flex-col'>
              <p>from:</p>
            <input
              type="datetime-local"
              value={assignBorrowedAt}
              onChange={(e) => setAssignBorrowedAt(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mb-2"
            />
            </div>
            <div>
              <p>To:</p>
            <input
              type="datetime-local"
              value={assignReturnWithin}
              onChange={(e) => setAssignReturnWithin(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mb-2"
            />
            </div>
            </div>
            <br />
            <div className="flex justify-around">
              <button
                onClick={handleBorrowSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
              >
                Request
              </button>
              <button
                onClick={() => setBorrowModalOpen(false)}
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
