"use client";

import MonthCalendar from "../components/dashboard/Calendar";

const HomePage = () => {

  const events = [
    { date: '2024-03-15', title: 'Team Meeting' },
    { date: '2024-03-20', title: 'Project Deadline' },
    { date: '2024-03-25', title: 'Conference Call' },
    // Add more events as needed
  ];

  return (
    <div>
      <MonthCalendar events={[]} />
    </div>
  );
};

export default HomePage;
