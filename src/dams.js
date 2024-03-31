import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './files/welcome';
import Registration from './files/register';
import Login from './files/login';
import Home from './files/home';
import { UserProvider } from './files/context';
import Settings from './files/settings';
import Employees from './files/employees';
import Assets from './files/assets';
import Profile from './files/profile';
import Details from './files/details';

function Dams() {

  return (
    <UserProvider>
    <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/employees" element={<Employees/>} />
          <Route path="/assets" element={<Assets/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/details/:id" element={<Details/>} />
        </Routes>
    </Router>
    </UserProvider>
  );
}

export default Dams;
