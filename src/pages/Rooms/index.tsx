import React, { useState, useEffect } from 'react';
import makeRequest from '../../utils/makeRequest';
import { roomsUri } from '../../constants/Uri/config';
import RoomModal from '../../components/EventModal';
import DatePicker from 'react-datepicker';
import listPlugin from '@fullcalendar/list';
import img from '../../assets/meeting.jpg';
import FullCalendar from '@fullcalendar/react';

interface RoomProps {
  showAll: boolean;
}

export const Rooms: React.FC<RoomProps> = ({ showAll }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const currentDate = new Date();
  const [fromDate, setFromDate] = useState<any>(currentDate);
  const [toDate, setToDate] = useState<any>(currentDate);
  const [unavailableRooms, setUnavailableRooms] = useState([]);

  const handleRoomSelect = (room: any) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    makeRequest(roomsUri.getRooms, 'GET', null, {
      authorization: localStorage.getItem('token') || null,
    }).then((res) => {
      setRooms(res);
      handleSearch();
    });
  }, []);

  const handleSearch = () => {
    makeRequest(roomsUri.searchRooms, 'GET', null, {
      authorization: localStorage.getItem('token') || null,
    }, {
      from: fromDate,
      to: toDate
    }).then((res) => {
      setSearchResults(res);
      const availableRooms = rooms.filter((room: any) => {
        const roomNo = room.roomNo;
        const isAvailable = res.every((availableRoomNo: any) => availableRoomNo.roomNo !== roomNo);
        return isAvailable;
      });
  
      setUnavailableRooms(availableRooms);
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Rooms</h1>
      <div className="flex space-x-4">
        <div className='flex flex-col'>
          <div className="flex space-x-4">
            <DatePicker
              selected={fromDate}
              minDate={currentDate}
              onChange={(date: any) => setFromDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full my-2"
            />
            <DatePicker
              selected={toDate}
              minDate={fromDate}
              onChange={(date: any) => setToDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full my-2"
              // filterTime={filterPassedTime}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
            Search
            </button>
          </div>
          <br></br>
          {unavailableRooms.length>0 ?
            <div>
              <h2 className="text-xl font-semibold mb-2">Search Results</h2>
            </div>
            :
            <div>
              <h2 className="text-xl font-semibold mb-2">All rooms are available now!</h2>
            </div>
          }
          <div className="flex flex-wrap">
            {searchResults.map((room: any) => (
              <div key={room.id} className="w-1/3 p-4">
                <div className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleRoomSelect(room.roomNo)}
                >
                  <img
                    src={img}
                    alt={`Room ${room.roomNo}`}
                    className="w-full h-40 object-cover rounded"
                  />
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold">{`Room ${room.roomNo}`}</h3>
                    <FullCalendar
                      plugins={[ listPlugin ]}
                      initialView="listDay"
                      headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'listDay'
                      }}
                      displayEventTime
                      events={ room.occupancy.map((occupancy: any) => ({
                        title: occupancy.eventName,
                        date: occupancy.from
                      }) )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {showAll && unavailableRooms.length>0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Unavailable Rooms</h2>
              <div className="flex flex-wrap">
                {unavailableRooms.map((room: any) => (
                  <div key={room.id} className="w-1/3 p-4">
                    <div className="bg-gray-200 shadow-md rounded-lg p-4">
                      <img
                        src={img}
                        alt={`Room ${room.roomNo}`}
                        className="w-full h-40 w-200 object-cover rounded"
                      />
                      <div className="mt-2">
                        <h3 className="text-lg font-semibold">{`Room ${room.roomNo}`}</h3>
                        <FullCalendar
                          plugins={[ listPlugin ]}
                          initialView="listDay"
                          headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'listDay'
                          }}
                          displayEventTime
                          initialDate={fromDate}
                          events={ room.occupancy.map((occupancy: any) => ({
                            title: occupancy.eventName,
                            date: new Date(occupancy.from)
                          }) )
                          }
                        />
                        {/* <p className="text-gray-500">{`Available from: ${room}`}</p> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
              <div className="relative z-50 bg-white p-4 rounded-lg">

                <RoomModal onClose={closeModal} isOpen={isModalOpen} roomNo={selectedRoom} />
                    
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
