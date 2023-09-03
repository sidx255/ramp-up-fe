import React, { useEffect, useState } from 'react';
import { BASE_URL, homeUri, roomsUri } from '../../constants/Uri/config';
import makeRequest from '../../utils/makeRequest';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import { toast, ToastContainer } from 'react-toastify';

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  roomNo?: any;
  team?: any;
  eventData?: any; 
  from?: any;
  to?: any;
}

const Modal: React.FC<ModalProps> = ({ onClose, isOpen, roomNo = null, team, eventData, from, to }) => {
  const isUpdating = eventData ? true : false; // Check if eventData is provided for updating
  const [users, setUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<any>({});
  const [searchResults, setSearchResults] = useState<any>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(roomNo);
  const [formData, setFormData] = useState<any>( isUpdating ? {
    empNos: selectedEvent.empNos,
    organizer: selectedEvent.organizer,
    eventName: selectedEvent.eventName,
    from: selectedEvent.from,
    to: selectedEvent.to,
    description: selectedEvent.description,
    roomNo: selectedEvent.roomNo,
    link: selectedEvent.link
  } : {
    empNos: team ? [team.id] : [JSON.parse(localStorage.getItem('email') || '')],
    organizer: JSON.parse(localStorage.getItem('email') || ''),
    eventName: '',
    from: from,
    to: to,
    description: '',
    roomNo: roomNo,
    link: ''
  } );

  const getEventDetails = async (id: any) => {
    try {
      const res = await makeRequest(BASE_URL + `/event/${id}`, 'GET', {}, {
        authorization: localStorage.getItem('token') || null,
      });
      setSelectedEvent(res);
      setSelectedRoom(res.roomNo);
      setFormData(res); 
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const handleSearch = () => {
    makeRequest(roomsUri.searchRooms, 'GET', null, {
      authorization: localStorage.getItem('token') || null,
    }, {
      from: formData.from || from,
      to: formData.to || to
    }).then((res) => {
      setSearchResults(res);
    }).catch((error) => {
      console.error('Error fetching search results:', error);
    });
  };

  const handleRoomChange = (selectedOptions: any) => {
    setFormData({ ...formData, roomNo: selectedOptions.value });  
    setSelectedRoom(selectedOptions.value);
  };

  useEffect(() => {
    if (isUpdating && eventData) {
      getEventDetails(eventData);
    }
    makeRequest(homeUri.getAllUsers, 'GET', {}, {
      authorization: localStorage.getItem('token') || null,
    }).then(res => {
      setUsers(res);
    });
  }, [isUpdating, eventData]);

  useEffect(() => {
    if((formData.from || from)  && (formData.to || to)) handleSearch();
  }, [formData.from, formData.to, from, to]);

  const createOrUpdateEvent = async (formData: any) => {
    const requestUri = isUpdating ? `${homeUri.editEvent}/${eventData}` : homeUri.createEvent;
    const requestMethod = isUpdating ? 'PATCH' : 'POST';

    try {
      const response = await makeRequest(requestUri, requestMethod, formData, {
        authorization: localStorage.getItem('token') || null,
      });

      return response;
    } catch (error) {
      console.error('Error creating/updating event:', error);
    }
  };

  const handleFormSubmit = async () => {
    if (!(formData.empNos && formData.organizer && formData.eventName && formData.from && formData.to))
      toast.error('Please fill all necessary details');
    else {
      createOrUpdateEvent(formData)
        .then((res) => {
          if(res.error){
            toast.error('Room is already booked for this time slot');
          } 
          else {
            onClose();
            window.location.reload();
          }
        }).catch((error) => {
          toast.error('Room is already booked for this time slot');
        });
    }
  };

  const handleEmpNosChange = (selectedOptions: any) => {
    const selectedEmpNos = selectedOptions.map((option: any) => option.value);
    setFormData({ ...formData, empNos: selectedEmpNos });
  };

  const handleDeleteEvent = async(id: any) => {
    makeRequest(homeUri.deleteEvent+`/${id}`, 'DELETE', null, {
      authorization: localStorage.getItem('token') || null,
    }).then((res) => {
      onClose();
      window.location.reload();
    });
  };

  useEffect(() => {
    if (eventData) {
      getEventDetails(eventData);
    }
  }, []);

  return (
    <div className={`modal ${isOpen ? 'flex' : 'hidden'} items-center justify-center fixed inset-0 z-1000`}>
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="modal-container bg-white w-full md:max-w-screen-sm mx-auto rounded-lg shadow-lg z-50 overflow-hidden">
        <div className="modal-content py-6 px-8">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">
              {isUpdating ? 'Update Event' : 'Create Event'}
            </p>
            <button
              onClick={onClose}
              className="modal-close cursor-pointer hover:text-gray-600"
            >
              <svg
                className="fill-current text-black w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  className="heroicon-ui"
                  d="M6.293 6.293a1 1 0 011.414 0L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z"
                />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Organizer"
            value={formData.organizer || ''}
            onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
          />
          <input
            type="text"
            placeholder="Event Name"
            value={formData.eventName || ''}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
          />
          <Select
            isMulti
            options={users.map((user: any) => ({ value: user.email, label: `${user.name} <${user.email}>` })) || null }
            value={formData.empNos ? formData.empNos.map((email: any) => ({ value: email, label: email })) : 'null'}
            onChange={handleEmpNosChange}
            placeholder="Select guest(s)"
          />
          <DatePicker
            selected={(formData.from ? new Date(formData.from) : null) || from}
            onChange={(date: any) => setFormData({ ...formData, from: date })}
            minDate={new Date()}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full my-2"
            placeholderText={'Start date and time'} 
          />
          <DatePicker
            selected={(formData.to ? new Date(formData.to) : null) || to}
            minDate={formData.from ? new Date(formData.from) : null}
            onChange={(date: any) => setFormData({ ...formData, to: date })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full my-2"
            placeholderText={'End date and time'} 
          />
          <div className='flex flow-row justify-center pb-2 gap-x-2'>
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className='w-[280px]'>
              <Select
                options={searchResults.map((roomNo: any) => ({ value: roomNo.roomNo, label: `${roomNo.roomNo}` })) || null }
                value={{ value: selectedRoom, label: selectedRoom }}
                onChange={handleRoomChange}
                placeholder="Choose a room"
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="Link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={handleFormSubmit}
            >
              {isUpdating ? 'Update' : 'Create'}
            </button>
            {isUpdating && (
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleDeleteEvent(eventData)}
              >
              Delete
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
    // </div>
  );};

export default Modal;

