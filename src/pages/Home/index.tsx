import React from 'react';
// import { MonthCalendar } from '../../components/MonthCalendar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import makeRequest from '../../utils/makeRequest';
import { homeUri } from '../../constants/Uri/config';
import Modal from '../../components/EventModal';

function renderEventContent(eventInfo: { timeText: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; event: { title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }; }) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export const Home = () => {
  const [events, setEvents] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
          title: event.eventName,
          start: new Date(event.from),
        };
      }));
      
      console.log('lol events', events);
    }).catch(err => {
      console.log(err);
    });
  };

  React.useEffect(() => {
    handleEvents();
  }
  , []);
  console.log(events);
  return (
    <div>
      <button
        onClick={openModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Event
      </button>
      <div className='overlay z-10'>
        <Modal onClose={closeModal} isOpen={isModalOpen}/>
      </div>
      <div className='flex flex-col w-full'>
        <div className='flex flex-row h-full'>
          <div className='flex w-4/6'>
            {events && <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              contentHeight={500}
              handleWindowResize={true}
              eventContent={renderEventContent}
            />
            
            }
          </div>
          <div className='flex flex-col'>
            <span className='text-2xl'>Upcoming Events</span>
            <ul className='mt-2'>
              {events.map((event: any, index) => (
                <li key={index} className='mb-2'>
                  <strong>{event.title}</strong><br />
                  <span>{event.start.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};