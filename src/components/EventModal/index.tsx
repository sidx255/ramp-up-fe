import React, { useEffect, useState } from 'react';
import { BASE_URL, homeUri } from '../../constants/Uri/config';
import makeRequest from '../../utils/makeRequest';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  roomNo?: any;
  team?: any;
  eventData?: any; 
}

const Modal: React.FC<ModalProps> = ({ onClose, isOpen, roomNo, team, eventData }) => {
  const isUpdating = eventData ? true : false; // Check if eventData is provided for updating
  const [users, setUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<any>({});
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
    from: '',
    to: '',
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
      setFormData(res); // Set formData with selectedEvent data
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
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
    await createOrUpdateEvent(formData);
    onClose();
    window.location.reload();

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
    <div className={`modal ${isOpen ? 'flex' : 'hidden'}`}>
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">{isUpdating ? 'Update Event' : 'Create Event'}</p>
            <button onClick={onClose} className="modal-close cursor-pointer z-50">
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >

                <path
                  className="heroicon-ui"
                  d="M6.293 6.293a1 1 0 011.414 0L9 7.586l1.293-1.293a1 1 0 111.414 1.414L10.414 9l1.293 1.293a1 1 0 01-1.414 1.414L9 10.414l-1.293 1.293a1 1 0 01-1.414-1.414L7.586 9 6.293 7.707a1 1 0 010-1.414z"
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
            selected={formData.from ? new Date(formData.from) : null}
            onChange={(date: any) => setFormData({ ...formData, from: date })}
            minDate={new Date()}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full my-2"
          />
          <DatePicker
            selected={formData.to ? new Date(formData.to) : null}
            minDate={formData.from ? new Date(formData.from) : null}
            onChange={(date: any) => setFormData({ ...formData, to: date })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full my-2"
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Room No"
            value={formData.roomNo || roomNo}
            onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4" onClick={handleFormSubmit}>
            {isUpdating ? 'Update' : 'Create'}
          </button>
          {isUpdating && (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 mt-4"
              onClick={() => handleDeleteEvent(eventData)}
            >
    Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
