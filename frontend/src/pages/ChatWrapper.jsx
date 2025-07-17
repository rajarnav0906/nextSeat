import { useParams } from 'react-router-dom';
import Chat from './Chat.jsx';

const ChatWrapper = () => {
  const { connectionId } = useParams();
  const user = JSON.parse(localStorage.getItem('user-info'));
  const currentUserId = user?._id;
  const isTripActive = true;

  return (
  <div className="min-h-screen bg-gradient-to-br from-white to-[#f0f4f8] flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-5xl space-y-4">
      {/* 🔒 Safety Notice */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-5 py-3 rounded-xl text-sm shadow-sm">
        🔒 <strong>This chat is intended strictly for travel coordination</strong> between verified students.
        Please keep conversations respectful and relevant. Messages may be reviewed to ensure a safe and trustworthy environment for all users.
      </div>

      <Chat
        connectionId={connectionId}
        currentUserId={currentUserId}
        isTripActive={isTripActive}
      />
    </div>
  </div>
);

};

export default ChatWrapper;