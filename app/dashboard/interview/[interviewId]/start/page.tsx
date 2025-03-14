'use client'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import Link from 'next/link';

const StartInterview = () => {
    const params = useParams();
    const interviewId = params?.interviewId as string;
    const [interviewDetails, setInterviewDetails] = useState<any>(null);
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState<any>(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId));

        const jsonMockresponce = JSON.parse(result[0].jsonMockResp);
        // console.log(jsonMockresponce)
        setMockInterviewQuestions(jsonMockresponce);
        setInterviewDetails(result[0]);
    }

    useEffect(() => {
        if (!interviewId) return;
        getInterviewDetails();
    }, []);

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <QuestionSection InterviewQuestions={mockInterviewQuestions} activeQuestionIndex={activeQuestionIndex} />

                <RecordAnswerSection InterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex} interviewDetails={interviewDetails} />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                <div></div>
                <div className='flex justify-evenly'>
                    {activeQuestionIndex > 0 && <button type='button' className='btn btn-ghost' onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}> Previous Question </button>}
                    {activeQuestionIndex < mockInterviewQuestions?.length - 1 && <button type='button' className='btn btn-ghost' onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}> Next Question </button>}
                    {activeQuestionIndex === mockInterviewQuestions?.length - 1 &&
                        <Link href={`/dashboard/interview/${interviewDetails?.mockId}/feedback`}> <button type='button' className='btn btn-ghost'> End Interview </button></Link>}
                </div>
            </div>
        </div>
    )
}

export default StartInterview
