import { useEffect, useState } from 'react';
import IDUpload from './IDUpload';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('user-info'));
    if (!info) return navigate('/login');
    setUser(info);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user-info');
    navigate('/login');
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('user-info', JSON.stringify(updated));
  };

  if (!user) return null;

  const showUpload = !user.declaredGender || !user.branch;

  return (
    <div className="min-h-screen bg-[#FAFFCA] text-[#2D2D2D] p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#5A827E] hover:bg-[#84AE92] text-white rounded-lg"
        >
          Logout
        </button>
      </div>

      {showUpload ? (
        <IDUpload userId={user._id} onSuccess={updateUser} />
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-lg max-w-md">
          <h2 className="text-xl font-semibold mb-2">Your Details</h2>
          <p><strong>Gender:</strong> {user.declaredGender}</p>
          <p><strong>Branch:</strong> {user.branch}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
