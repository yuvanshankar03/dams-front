import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import UserContext from './context';
import Sidebar from './sidebar';
import { List } from 'react-bootstrap-icons';

export default function Contact(){
    const [isOpen, setIsOpen] = useState(false);
    const { userRole } = useContext(UserContext);


    const handleshow = () =>{
        setIsOpen(!isOpen)
      }

      

    return(<>
    <div className="flex gap-3 items-center px-3 mt-2">
    <List
      size={24}
      className="mb-3.5 cursor-pointer"
      onClick={handleshow}
    />
    <h1 className="text-2xl font-semibold mb-4 px-4">
      Contact & help
    </h1>
  </div>
    {isOpen ? <Sidebar handleshow={handleshow} userRole={userRole} /> : null}
    </>)
}