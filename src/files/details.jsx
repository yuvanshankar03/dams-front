import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Details() {
  const { id } = useParams(); // Extracting the ID from the URL parameter
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch details based on ID
        const response = await axios.get(`/details/${id}`);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.response.data.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error: {error}</p>
      ) : (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          {data && (
            <div className="p-6">
              {data.role === 'admin' && (
                <>
                  <h2 className="text-xl font-semibold mb-2">Admin Details:</h2>
                  {data.profilePicture && <img src={`data:image/png;base64,${data.profilePicture}`} alt="Admin" className="mt-4 w-28 h-24 rounded-md" />}
                  <p>Username: {data.username}</p>
                  <p>Email: {data.email}</p>
                  <p>department: {data.department}</p>
                  {/* Add more admin details as needed */}
                </>
              )}
              {data.role === 'user' && (
                <>
                  <h2 className="text-xl font-semibold mb-2">User Details:</h2>
                  <p>profile</p>
                  {data.profilePicture && <img src={`data:image/png;base64,${data.profilePicture}`} alt="User" className="mt-4 w-28 h-24 rounded-md" />}
                  <p>Username: {data.username}</p>
                  <p>Email: {data.email}</p>
                  <p>department: {data.department}</p>
                  {/* Add more user details as needed */}
                </>
              )}
              {data.role !== 'admin' && data.role !== 'user' && (
                <>
                  <h2 className="text-xl font-semibold mb-2">Asset Details:</h2>
                  {data.picture && <img src={`data:image/png;base64,${data.picture}`} alt="Asset" className="mt-4 w-28 h-24 rounded-md" />}
                  <p>Name: {data.name}</p>
                  <p>Amount: ₹ {data.amount}</p>
                  <p>date: {data.date}</p>
                  {/* Add more asset details as needed */}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
