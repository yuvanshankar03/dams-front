import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const SearchUsers = ({ onSelect }) => {
  const [searchText, setSearchText] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false); // State to manage suggestion box visibility
  const inputRef = useRef(null); // Reference to input element

  useEffect(() => {
    if (searchText.length >= 4 && showSuggestions) {
      const fetchMatchingUsers = async () => {
        try {
          const response = await axios.get(`/${isAdmin ? "searchadmin" : "searchusers"}?search=${searchText}`);
          setMatchingUsers(response.data);
          setError('');
        } catch (error) {
          console.error('Error fetching matching users:', error);
          setError('Unable to fetch user data. Please input the correct name or email.');
        }
      };
      fetchMatchingUsers();
    } else {
      setMatchingUsers([]);
      setError('');
    }
  }, [searchText, isAdmin, showSuggestions]);

  const handleInputChange = debounce((text) => {
    setSearchText(text);
    setShowSuggestions(true);
  }, 10);

  const handleUserSelect = (user) => {
    setSearchText(user.username);
    setMatchingUsers([]);
    setShowSuggestions(false);
    onSelect(user);
  };

  return (
    <div className="flex flex-col relative">
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchText}
        onChange={(e) => handleInputChange(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 mb-2"
        ref={inputRef} // Assign inputRef to the input element
      />
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600 mt-0.5"
          onChange={() => setIsAdmin(!isAdmin)}
        />
        <span className="ml-2">Admin</span>
      </label>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {showSuggestions && matchingUsers.length > 0 && (
        <ul className="border border-gray-300 rounded-md shadow-md overflow-hidden absolute z-10 top-full left-0 right-0 mt-2"> {/* Add mt-2 to create space */}
          {matchingUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="cursor-pointer py-2 px-4 bg-gray-100 hover:bg-gray-300"
            >
              <span className="text-gray-900">{user.username}</span> ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUsers;
