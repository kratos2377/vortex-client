import React from 'react';
import { Color } from '../../../types/chess_types/constants';

const PlayerCard = ({ username , color}: {username: String, color: Color}) => {
  // Default to "Player" if username is undefined or empty
  const displayName = username?.trim() ? username : "Player";
  
  return (
    <div className="flex w-[10vh] h-[10vh] flex-col items-center bg-gray-800 rounded-lg p-4 shadow-md my-2">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 mb-2">

          <img 
          src={`https://robohash.org/${username}`}
            alt={`${displayName}'s avatar`} 
            className="w-full h-full object-cover"
          />

      </div>
      
      {/* Username */}
      <span className="text-white font-medium mb-2">{displayName}</span>

      <div className="text-white font-medium mt-2">{color === Color.WHITE ? "White Player" : "Black Player"}</div>
      
    </div>
  );
};



export default PlayerCard; // Ex