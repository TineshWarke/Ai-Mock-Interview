import React from 'react';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';

function Dashboard() {
    return (
        <div className="p-6 md:p-10">
            <h2 className="font-bold text-2xl text-cyan-500">Dashboard</h2>
            <h2 className="text-gray-500">Create and start your AI mockup interview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-5">
                <AddNewInterview />
            </div>

            <InterviewList />
        </div>
    );
}

export default Dashboard;
