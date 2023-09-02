import React from 'react';

const Timeline = () => {
  const timeSlots = [];
  for (let i = 0; i <= 24; i++) {
    const time = `${i.toString().padStart(2, '0')}:00`;
    timeSlots.push(time);
  }

  return (
    <div className="timeline">
      {timeSlots.map((time, index) => (
        <div key={index} className="time-slot">
          {time}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
