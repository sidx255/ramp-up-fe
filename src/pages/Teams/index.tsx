import React from 'react';
import { teamsUri } from '../../constants/Uri/config';
import makeRequest from '../../utils/makeRequest';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export const Teams = () => {
  const [teams, setTeams] = React.useState<any>([]);
  const calendarRef = React.useRef(null);

  React.useEffect(() => {
    makeRequest(teamsUri.getTeams, 'GET', null, {
      authorization: localStorage.getItem('token') || null
    })
      .then((res) => {
        setTeams(res);
      });
  }, []);

  return (
    <div>
      <div className='flex flex-col space-y-2'>
        <h2>Teams</h2>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          Add Team
        </button>

        <div>
          <ul>
            {teams.map((team: any) => (
              <div key={team.id}>
                {team.description}
                <ul>
                  {team.empNos.map((empNo: any) => (
                    <li key={empNo}>{empNo}</li>
                  ))}
                </ul>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  // events={team.empNos.map((empNo: any) => ({
                  //   title: `Employee ${empNo}`,
                  // }))}
                />
              </div>
            ))}
          </ul>
          {/* <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={false}
          /> */}
        </div>
      </div>

    </div>
  );

};