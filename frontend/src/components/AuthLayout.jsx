import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-1 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <Outlet />
        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default AuthLayout;