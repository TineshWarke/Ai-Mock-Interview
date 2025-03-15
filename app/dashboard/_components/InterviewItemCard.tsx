import { useRouter } from 'next/navigation';
import React from 'react';

interface Interview {
    id: number;
    jsonMockResp: string;
    jobPosition: string;
    jobDesc: string;
    jobExperience: string;
    createdBy: string;
    createdAt: string;
    mockId: string;
}
const InterviewItemCard = ({ interview }: { interview: Interview }) => {
    const router = useRouter();

    return (
        <div className="border rounded-lg shadow-sm p-3">
            <h2 className="font-bold text-cyan-500">{interview.jobPosition}</h2>
            <h2 className="text-sm text-gray-600">{interview.jobExperience} Years of Experience</h2>
            <h2 className="text-xs text-gray-400">Created at: {new Date(interview.createdAt).toLocaleDateString()}</h2>

            <div className="flex justify-between mt-2">
                <button type="button" className="btn btn-ghost hover:bg-cyan-100 hover:border-cyan-500 btn-sm w-5/11" onClick={() => router.push(`/dashboard/interview/${interview.mockId}/feedback`)}>
                    Feedback
                </button>
                <button type="button" className="btn btn-sm hover:bg-cyan-100 hover:border-cyan-500 w-5/11" onClick={() => router.push(`/dashboard/interview/${interview.mockId}`)}>
                    Start
                </button>
            </div>
        </div>
    );
};

export default InterviewItemCard;
