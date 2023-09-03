import React from 'react';
// import { MonthCalendar } from '../../components/MonthCalendar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import makeRequest from '../../utils/makeRequest';
import { homeUri } from '../../constants/Uri/config';
import Modal from '../../components/EventModal';
import { Rooms } from '../Rooms';

function renderEventContent(eventInfo: { timeText: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; event: { title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }; }) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export const Home = () => {
  const [event, setEvent] = React.useState('');
  const [events, setEvents] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    handleEvents();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEvent(''); 
  };
  

  const handleEvents = () => 
  {
    makeRequest(homeUri.myEvents, 'GET', null,
      {
        authorization: localStorage.getItem('token')
      }
    ).then(res => {
      setEvents(res.map((event: any) => {
        return {
          id: event.id,
          title: event.eventName,
          start: new Date(event.from),
          // empNos: event.empNos,
          // organizer: event.oraganizer,
          // eventName: event.eventName,
          // from: event.from,
          to: new Date(event.to),
          // description: event.description,
          roomNo: event.roomNo,
          // link: event.roomNo
        };
      }));
      
    }).catch(err => {
      console.log(err);
    });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
              <div className="relative z-50 bg-white p-4 rounded-lg">
                {
                  event ? 
                    <Modal onClose={closeModal} isOpen={isModalOpen} eventData={event} />
                    : 
                    <Modal onClose={closeModal} isOpen={isModalOpen} />
                }
              </div>
            </div>
          )}
        </div>
        <div className="flex">
          <div className="w-2/3 pr-4">
            <div className='flex flex-row justify-between'>
              <h1 className="text-2xl font-semibold">Calendar</h1>
              <button
                onClick={openModal}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
            Create Event
              </button>
            </div>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              handleWindowResize={true}
              eventContent={renderEventContent}
              eventClick={event => {
                setEvent(event.event.id);
                openModal();
              }}
            />
          </div>
          <div className="w-1/3">
            <h1 className="text-2xl font-semibold pb-3">Upcoming Events</h1>
            <table className="table-auto w-full">
              <thead className='bg-gray-100'>
                <tr>
                  <th className="px-4 py-2">Event Name</th>
                  <th className="px-4 py-2">From</th>
                  <th className="px-4 py-2">To</th>
                  <th className="px-4 py-2">Room No</th>
                </tr>
              </thead>
              <tbody>
                {events
                  .filter((event: any) => new Date(event.start) > new Date())
                  .map((event: any, index) => (
                    <tr key={index} className="mb-2 hover:bg-gray-50"
                      onClick={() => {
                        setEvent(event.id);
                        openModal();
                      }}>
                      <td className="border px-4 py-2">{event.title}</td>
                      <td className="border px-4 py-2">
                        {new Date(event.start).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(event.to).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">{event.roomNo}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4">
          <Rooms showAll={false} />
        </div>
      </div>
    </div>

  );
};
