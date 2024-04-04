import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BorrowedAssetItems = ({ currentUser }) => {
  const [borrowedAssets, setBorrowedAssets] = useState([]);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [extensionModalOpen, setExtensionModalOpen] = useState(false);
  const [extensionReason, setExtensionReason] = useState('');
  const [extensionDuration, setExtensionDuration] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState('');

  useEffect(() => {
    fetchBorrowedAssets();// eslint-disable-next-line
  }, []);


  const fetchBorrowedAssets = async () => {
    try {
      const email = localStorage.getItem(currentUser === 'admin' ? 'adminemail' : 'useremail');
      const response = await axios.get(`${currentUser === 'admin' ? '/borrowedAssets' : '/userborrowedAssets'}?email=${email}`);
      setBorrowedAssets(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching borrowed assets:', error);
    }
  };

  const handleReturn = async () => {
    try {
      await axios.put(`/assets/${selectedAssetId}/return`);
      fetchBorrowedAssets();
      setReturnModalOpen(false);
      window.location.reload()
    } catch (error) {
      console.error('Error returning asset:', error);
    }
  };

  const handleExtensionRequest = async () => {
    try {
      const email = localStorage.getItem( currentUser === 'admin' ? 'adminemail' : 'useremail');
      const response = await axios.post(`${currentUser === 'admin'? '/adminextensions' :'/extensions'}`, {
        selectedAssetId,
        email,
        extensionReason,
        extensionDuration,
      });
      console.log('Extension requested:', response.data.message);
      setExtensionModalOpen(false);
    } catch (error) {
      console.error('Error requesting extension:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Create date using provided date string
    return date.toLocaleString('en-IN', { timeZone: date.getTimezoneOffset() / -60 }); // Use date's time zone
  };  

  const calculateTimeDifference = (returnWithin) => {
    const currentTime = new Date();
    const returnTime = new Date(returnWithin);
    const differenceInMs = returnTime - currentTime;
    const differenceInHours = differenceInMs / (1000 * 60 * 60);
    return Math.abs(differenceInHours);
  };

const borrowedAssetsToDisplay = borrowedAssets.filter(asset => asset.assetStatus === 'borrowed');


return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
 {isLoading ? (
        <p>Loading borrowed assets...</p>
      ) : borrowedAssetsToDisplay.length === 0 ? (
        <p>No assets are currently borrowed.</p>
      ) : (
        borrowedAssetsToDisplay.map(borrowedAsset => (
          <div key={`asset_group_${borrowedAsset.assetId}`} className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition duration-300">
            {/* Render asset group details */}
            <div className="relative">
              {borrowedAsset.image && <img src={`data:image/jpeg;base64,${borrowedAsset.image}`} alt={borrowedAsset.assetName} className="w-full h-40 object-cover" />}
              <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1">{borrowedAsset.assetName}</div>
            </div>
            <div className="p-4">
                <div>
                  <p className="text-gray-600">Asset name: <span className='font-semibold'>{borrowedAsset.assetName}</span></p>
                  <p className="text-gray-600">Ref No: <span className='font-semibold'>{borrowedAsset.assetRefno}</span></p>
                  <p className="text-gray-600">borrowedAt: <span className='font-semibold'>{formatDate(borrowedAsset.borrowedAt)}</span></p>
                  <p className="text-gray-600">returnwithin: <span className='font-semibold'>{formatDate(borrowedAsset.returnWithin)}</span></p>
                  <p className="text-gray-600">status: <span className='font-semibold'>{borrowedAsset.assetStatus}</span></p>
                  {calculateTimeDifference(borrowedAsset.returnWithin) < 1 ? (
                    <div className="text-red-500">
                      You have less than one hour to return this asset!
                    </div>
                  ) : null}
                  <button
                    onClick={() => {
                      setSelectedAssetId(borrowedAsset.assetId);
                      setReturnModalOpen(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 mr-2"
                  >
                    Return
                  </button>
                  {new Date(borrowedAsset.returnWithin) < new Date() && (
                    <button
                      onClick={() => {setExtensionModalOpen(true)
                        setSelectedAssetId(borrowedAsset.assetId)}}
                      className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 mr-2"
                    >
                      Request Extension
                    </button>
                  )}
                </div>
            </div>
          </div>
        ))
      )}
    {/* Extension modal */}
    {extensionModalOpen && (
      <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="modal bg-white p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Request Extension</h2>
          <label htmlFor="extensionReason" className="block mb-2">
            Reason for extension:
            <input
              type="text"
              id="extensionReason"
              value={extensionReason}
              onChange={(e) => setExtensionReason(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          </label>
          <label htmlFor="extensionDuration" className="block mb-2">
            Duration for extension (days or hours):
            <input
              type="datetime-local"  // Change input type to datetime-local
              id="extensionDuration"
              value={extensionDuration}
              onChange={(e) => setExtensionDuration(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          </label>
          <div className="flex justify-end">
            <button
              onClick={handleExtensionRequest}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
            >
              Request
            </button>
            <button
              onClick={() => setExtensionModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    {/* Return modal */}
    {returnModalOpen && (
      <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="modal bg-white p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Confirm Return</h2>
          <p>Are you sure you want to return this asset?</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleReturn}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
            >
              Yes
            </button>
            <button
              onClick={() => setReturnModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default BorrowedAssetItems;