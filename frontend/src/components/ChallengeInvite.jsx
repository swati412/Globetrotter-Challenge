import { useState } from 'react';
import { useSelector } from 'react-redux';

const ChallengeInvite = () => {
  const { username } = useSelector((state) => state.user);
  const [inviteCode, setInviteCode] = useState('');

  const handleGenerateInvite = () => {
    // In a real app, this would generate a unique invite code from the backend
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(code);
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Invite Friends</h3>
      <p className="text-gray-600 mb-4">
        Share this invite code with your friends to challenge them:
      </p>
      
      {inviteCode ? (
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">{inviteCode}</p>
          <button
            onClick={() => navigator.clipboard.writeText(inviteCode)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Copy Code
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerateInvite}
          className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Generate Invite Code
        </button>
      )}
    </div>
  );
};

export default ChallengeInvite; 