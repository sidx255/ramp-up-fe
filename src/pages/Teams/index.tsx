import React, {useState} from 'react';
import { BASE_URL, teamsUri, homeUri } from '../../constants/Uri/config';
import makeRequest from '../../utils/makeRequest';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import AddTeamModal from '../../components/AddTeamModal';
import Modal from '../../components/EventModal';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';

function renderEventContent(eventInfo: { timeText: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; event: { title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }; }) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export const Teams = () => {
  const [teams, setTeams] = React.useState<any>([]);
  const [event, setEvent] = React.useState<any>('');
  const [users, setUsers] = React.useState<any>([]);
  const [selectedTeam, setSelectedTeam] = React.useState<any>(null);
  const [newMember, setNewMember] = React.useState<any>([]);
  const [isEventModalOpen, setIsEventModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openModal = (teamId: any) => {
    setSelectedTeam(teamId);
    setIsEventModalOpen(true);
  };

  const closeModal = () => {
    setIsEventModalOpen(false);
    setEvent('');
  }; 

  React.useEffect(() => {
    makeRequest(homeUri.getAllUsers, 'GET', {}, {
      authorization: localStorage.getItem('token') || null,
    }).then(res => {
      setUsers(res);
    });
    makeRequest(teamsUri.getTeams, 'GET', null, {
      authorization: localStorage.getItem('token') || null
    })
      .then((res) => {
        setTeams(res);
      });
  }, []);


  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddTeam = async (newTeam: any) => {
    try {
      const response = await makeRequest(teamsUri.createTeams, 'POST', newTeam, {
        authorization: localStorage.getItem('token') || null
      });
  
      setTeams([...teams, response]);
      closeAddModal();
    } catch (error) {
      console.error('Error adding new team:', error);
    }
  };

  const handleTeamDelete = async (teamId: any) => {
    try {
      const url = BASE_URL+`/team/${teamId}`;
      await makeRequest(url, 'DELETE', null, {
        authorization: localStorage.getItem('token') || null
      });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const handleTeamEvents = async (teamId: any) => {
    try {
      const url = BASE_URL+`/events/team/${teamId}`;
      const response = await makeRequest(url, 'GET', null, {
        authorization: localStorage.getItem('token')
      });
      const events = response.map((event: any) => ({
        id: event.id,
        title: event.eventName,
        start: new Date(event.from)
      }));
      return events;
    } catch (error) {
      console.error('Error fetching team events:', error);
    }
  };

  const handleRemoveMember = async (teamId: any, empNo: any) => {
    const url = BASE_URL+`/team/${teamId}/removeUser`;
    makeRequest(url, 'PATCH', { empNos:
    [empNo] }, {
      authorization: localStorage.getItem('token') || null
    })
      .then((res) =>  {
        window.location.reload();
      });

  };

  const handleAddMember = (teamId: any, empNo: any) => {
    const url = BASE_URL+`/team/${teamId}/addUser`;
    makeRequest(url, 'PATCH', { empNos:
    [empNo] }, {
      authorization: localStorage.getItem('token') || null
    })
      .then((res) =>  {
        window.location.reload();
      });
  };

  const handleEmpOptions = (teamId: any) =>
  {
    const availableUsers = getAvailableUsers(teamId);
    return availableUsers.map((user: any) => ({
      value: user.email,
      label: `${user.name} <${user.email}>`,
    }));
  };

  const getAvailableUsers = (selectedTeam: any) => {
    if (selectedTeam) {
      const existingEmpNos = teams.find((team: any) => team.id === selectedTeam)?.empNos || [];
      return users.filter((user: any) => !existingEmpNos.includes(user.email));
    }
    return users;
  };

  const handleEmpNosChange = (selectedOptions: any) => {
    const selectedEmpNos = selectedOptions;
    setNewMember(selectedEmpNos);
  };

  return (
    <div className="p-4 container mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Teams</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={openAddModal}
      >
        Add Team
      </button>

      <AddTeamModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleAddTeam}
      />

      <div>
        <ul className='space-y-10'>
          {teams.map((team:any) => (
            <div key={team.id} className="bg-white p-4 shadow rounded-lg">
              <div className='flex flex-row justify-between'>
                <h3 className="text-3xl font-semibold">{team.description}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(team)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                  Create Event
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleTeamDelete(team.id)}
                  >
                  Delete Team
                  </button>
                </div>
              </div>
              {isEventModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
                  <div className="relative z-50 bg-white p-4 rounded-lg">
                    {
                      event ? 
                        <Modal onClose={closeModal} isOpen={isEventModalOpen} eventData={event} team={selectedTeam}/>
                        : 
                        <Modal onClose={closeModal} isOpen={isEventModalOpen} team={selectedTeam}/>
                    }
                  </div>
                </div>
              )}
              <ul>
                {team.empNos.map((empNo: any) => (
                  <div key={empNo} className="flex items-center">
                    <li className="mr-2">{empNo}</li>
                    <button
                      className="text-red-500"
                      onClick={() => handleRemoveMember(team.id, empNo)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-x"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.657 8l3.95-3.95a.5.5 0 0 0-.708-.708L8 7.293 4.05 3.343a.5.5 0 0 0-.708.708L7.293 8l-3.95 3.95a.5.5 0 0 0 .708.708L8 8.707l3.95 3.95a.5.5 0 0 0 .708-.708L8.707 8l3.95-3.95a.5.5 0 0 0-.708-.708L8 7.293 4.05 3.343a.5.5 0 0 0-.708.708L7.293 8 3.343 11.95a.5.5 0 0 0 .708.708L8 8.707l3.95 3.95a.5.5 0 0 0 .708-.708L8.707 8z"
                        />
                      </svg>
                    </button>
 
                  </div>
                ))}
                <div className='flex w-full'>
                  <div className='flex w-1/3'>
                    <Select className='w-full'
                      options={handleEmpOptions(team.id)}
                      value={newMember}
                      onChange={handleEmpNosChange}
                      placeholder="Select member(s)"

                    />
                  </div>
                  
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => {
                      if (!newMember.value) {
                        toast.error('Please select a member');
                      } else
                    
                        handleAddMember(team.id, newMember.value);}
                    }
                  >
        Add
                  </button>
                </div>
              </ul>

              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                eventContent={renderEventContent}
                events={async (fetchInfo, successCallback, failureCallback) => {
                  try {
                    const events = await handleTeamEvents(team.id);
                    successCallback(events);
                  } catch (error: any) {
                    console.error('Error fetching team events:', error);
                    failureCallback(error);
                  }
                }}
                eventClick={(event : any) => {
                  setEvent(event.event._def.publicId);
                  setIsEventModalOpen(true);
                }}
              />

            </div>
          ))}
        </ul>
      </div>
      <ToastContainer/>
    </div>

  );

};