import React, { useState, useEffect } from 'react';
import makeRequest from '../../utils/makeRequest';
import { roomsUri } from '../../constants/Uri/config';
import RoomModal from '../../components/RoomModal';

export const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    makeRequest(roomsUri.getRooms, 'GET', null, {
      authorization: localStorage.getItem('token') || null,
    }).then((res) => {
      setRooms(res);
    });
  }, []);

  const handleRoomSelect = (room: any) => {
    setSelectedRoom(room);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Rooms</h1>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-2">Search</h2>
          {/* Add search form here */}
        </div>
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-2">Available Rooms</h2>
          <ul>
            {rooms.map((room: any) => (
              <li
                key={room.id}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleRoomSelect(room)}
              >
                {room.roomNo}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedRoom && <RoomModal room={selectedRoom} />}
    </div>
  );
};

