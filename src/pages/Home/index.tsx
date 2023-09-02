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
          // to: event.to,
          // description: event.description,
          // roomNo: event.roomNo,
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
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <button
            onClick={openModal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Event
          </button>
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
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              contentHeight={500}
              handleWindowResize={true}
              eventContent={renderEventContent}
              eventClick={event => {
                setEvent(event.event.id);
                openModal();
              }}
            />
          </div>
          <div className="w-1/3">
            <div className="text-2xl mb-2">Upcoming Events</div>
            <ul>
              {events
                .filter((event: any) => new Date(event.start) > new Date())
                .map((event: any, index) => (
                  <li key={index} className="mb-2">
                    <strong>{event.title}</strong>
                    <br />
                    <span>{new Date(event.start).toLocaleString()}</span>
                    <button
                      className="text-red-500"
                      onClick={() => {
                        setEvent(event.id);
                        openModal();
                      }}
                    >
                      Edit event
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <Rooms showAll={false} />
        </div>

        {/* Modal */}

      </div>
    </div>
  );
};
