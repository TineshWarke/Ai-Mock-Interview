import { useRouter } from 'next/navigation';
import React from 'react'

const InterviewItemCard = ({ interview }: { interview: any }) => {
    const router = useRouter();

    const onStart = () => {
        router.push(`/dashboard/interview/${interview?.mockId}`);
    }

    const onFeedback = () => {
        router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
    }

    return (
        <div className='border rounded-lg shadow-sm p-3'>
            <h2 className='font-bold'>{interview?.jobPosition}</h2>
            <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
            <h2 className='text-xs text-gray-400'>Created at: {interview?.createdAt}</h2>

            <div className='flex justify-between mt-2'>
                <button type='button' className='btn btn-ghost btn-sm w-5/11' onClick={onFeedback}>Feedback</button>
                <button type='button' className='btn btn-sm w-5/11' onClick={onStart}>Start</button>
            </div>
        </div>
    )
}

export default InterviewItemCard
