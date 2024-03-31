import React from 'react';
import axios from 'axios';

const NotificationModal = ({ isOpen, currentUser, onClose, handleApprove, handleDecline, handleAccept, handleRequestDecline, extensionRequests }) => {
  

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-orange-500';
      case 'approved':
        return 'text-green-500';
      case 'declined':
        return 'text-red-500';
        case 'Requested':
          return 'text-blue-500';
      default:
        return 'text-gray-600';
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      // Make an HTTP PUT request to mark the notification as read
      await axios.put(`/mark-notification-read/${id}`);
      // Optionally, you can update the UI to reflect the notification being marked as read
      console.log(`Notification with ID ${id} marked as read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Handle errors here
    }
  };
  
  return (
    <div className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transition-transform ${isOpen ? 'transform translate-x-0' : 'transform translate-x-full'}`}>
      <div className="h-full overflow-y-auto">
        <div className="flex justify-between items-center gap-5 py-4 px-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none" onClick={onClose}>Close</button>
        </div>
        {currentUser === 'admin' ?
          <div className="px-6 py-4">
            <div>
            {extensionRequests
              .filter(request => request.extensionStatus === 'Pending')
              .map(request => (
                <div key={request.extensionId} className="mb-4">
                  <h2 className='underline'>Extension Request</h2>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>User:</span> {request.username}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>Department:</span> {request.department}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>Asset:</span> {request.assetName}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>userRole:</span> {request.role}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>Status:</span> <span className={`${getStatusColor(request.extensionStatus)}`}>{request.extensionStatus}</span></p>
                  <div className="mt-2">
                    <button className="px-4 py-2 bg-green-500 text-white rounded mr-2" onClick={() => handleApprove(request.extensionId)}>Approve</button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleDecline(request.extensionId)}>Decline</button>
                  </div>
                </div>
              ))}
              </div>
              <div>
            {extensionRequests
              .filter(request => request.assetStatus === 'Requested')
              .map(request => (
                <div key={request.assetId} className="mb-4">
                  <h2 className='underline'>Borrow Request</h2>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>User:</span> {request.username}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>Department:</span> {request.department}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>Asset:</span> {request.assetName}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>userRole:</span> {request.role}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>Status:</span> <span className={`${getStatusColor(request.assetStatus)}`}>{request.assetStatus}</span></p>
                  <div className="mt-2">
                    <button className="px-4 py-2 bg-green-500 text-white rounded mr-2" onClick={() => handleAccept(request.assetId)}>Accept</button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleRequestDecline(request.assetId)}>Decline</button>
                  </div>
                </div>
              ))}
              </div>
          </div>
          :
          <div className="px-6 py-4">
            {extensionRequests.map(request => (
              <div key={request.extensionId ? request.extensionId : request.requestId} className="mb-4">
                <p className={`text-sm text-gray-600`}><span className='font-semibold'>User:</span> {request.username}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>Department:</span> {request.department}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>Asset:</span> {request.assetName}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>userRole:</span> {request.role}</p>
                  <p className={`text-sm text-gray-600`}><span className='font-semibold'>Status:</span> <span className={`${getStatusColor(request.assetStatus ? request.assetStatus : request.extensionStatus)}`}>{request.assetStatus ? request.assetStatus : request.extensionStatus}</span></p>
                  <button className='hover:text-blue-400' onClick={()=>handleMarkAsRead(request.extensionId ? request.extensionId : request.requestId)}>mark as read</button>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default NotificationModal;
