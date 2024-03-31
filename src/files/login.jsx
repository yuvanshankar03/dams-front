import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from './context';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');
  const { setUserRole } = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    axios
      .post(`${isAdmin ? "adminlogin" : "userlogin"}`, { email, password, adminSecretInput: isAdmin ? adminSecret : undefined })
      .then((response) => {
        setError("");
        setUserRole(isAdmin?'admin':'user');
        localStorage.setItem('userRole',isAdmin ? 'admin' : 'user')
        localStorage.setItem(isAdmin?'adminemail':'useremail', email);
        localStorage.setItem(isAdmin ? 'admintoken':'usertoken',response.data.token)
        navigate(`/home`)
      })
      .catch((error) => {
        console.error(error);
        setError("Invalid credentials. Please try again.");
      });
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isAdmin ? 
          <input
            type="text"
            placeholder="Admin Secrect"
            className="mb-2 p-2 border rounded w-full"
            onChange={(e) => setAdminSecret(e.target.value)}
          />:null}
        <label className="inline-flex items-center mb-4">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            onChange={() => setIsAdmin(!isAdmin)}
          />
          <span className="ml-2 text-gray-700">Admin</span>
        </label>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Login
        </button>
        <div className="mt-4 text-center">
          <a href="/" className="text-blue-500 hover:text-blue-700 font-semibold">Back to main</a>
        </div>
        {error && <div className="mt-4 text-red-500">{error}</div>}
      </form>
    </div>
  </div>
  );
}

