import { useParams } from 'react-router-dom';
import Chat from './Chat.jsx';
import { Lock, MessageSquare, Pencil, Shield, AlertTriangle } from 'lucide-react';

const ChatWrapper = () => {
  const { connectionId } = useParams();
  const user = JSON.parse(localStorage.getItem('user-info'));
  const currentUserId = user?._id;
  const isTripActive = true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#f0f4f8] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl space-y-4">

        {/* Safety Notice */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-5 py-3 rounded-xl text-sm shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
            <p>
              <strong>This chat is strictly for travel coordination</strong> between verified students.
              Please maintain a respectful and helpful tone. Chats may be reviewed to keep the platform safe for everyone.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
            <p>
              <strong>Note:</strong> You can send up to <span className="font-semibold text-blue-600">20 messages per day</span> for each connected trip.
              This limit helps reduce unnecessary database storage and ensures meaningful communication.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Pencil className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
            <p>
              Be brief and to the point to make each message count.
            </p>
          </div>

          <div className="flex items-start gap-3 pt-2 border-t border-blue-200/50">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
            <p className="text-xs">
              Never share personal information beyond what's necessary for travel coordination.
            </p>
          </div>
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