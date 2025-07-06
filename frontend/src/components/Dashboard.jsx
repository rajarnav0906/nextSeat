import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user-info');
    const userData = JSON.parse(data);
    setUserInfo(userData);
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user-info');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="flex flex-col items-center space-y-4">
          {userInfo?.image && (
            <img 
              src={userInfo.image} 
              alt={userInfo.email} 
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
          )}
          
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {userInfo?.name}</h1>
          
          <div className="w-full bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg text-gray-600">
              <span className="font-semibold">Email:</span> {userInfo?.email}
            </h3>
          </div>
          
          <button 
            onClick={handleLogout}
            className="mt-6 px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard