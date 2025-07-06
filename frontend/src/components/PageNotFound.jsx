import React from 'react'
import { useNavigate } from 'react-router-dom'

function PageNotFound() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="text-center max-w-md">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">404</h1>
                <p className="text-xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Back to Login page
                </button>
            </div>
        </div>
    )
}

export default PageNotFound