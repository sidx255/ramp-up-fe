import React, { useState } from 'react';

interface RoomModal {
  room: any;
}

const RoomModal: React.FC<RoomModal> = ({ room }) => {
  const [eventDetails, setEventDetails] = useState({
    eventName: '',
    organizer: '',
    from: '',
    to: '',
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleBookingSubmit = () => {
    // Implement your booking submission logic here
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Book Room: {room.roomNo}</h2>
        <form onSubmit={handleBookingSubmit}>
          <div className="mb-2">
            <label className="block text-sm font-medium">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={eventDetails.eventName}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          {/* Other input fields for organizer, from, to */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Book Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
