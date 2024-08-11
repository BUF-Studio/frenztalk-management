"use client";

import MonthCalendar from "../components/dashboard/Calendar";

const HomePage = () => {

  const events = [
    { date: '2024-08-15', title: 'Team Meeting' },
    { date: '2024-08-20', title: 'Project Deadline' },
    { date: '2024-08-25', title: 'Conference Call' },
    // Add more events as needed
  ];

  return (
      <MonthCalendar events={events} />
  );
};

export default HomePage;
