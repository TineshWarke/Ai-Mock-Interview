'use client'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import Link from 'next/link';

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

type MockResponse = { Question: string; Answer: string };

const StartInterview: React.FC = () => {
    const params = useParams();
    const interviewId = params?.interviewId as string;
    const [interviewDetails, setInterviewDetails] = useState<Interview | null>(null);
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState<MockResponse[]>([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

    const getInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, interviewId));

            if (result.length > 0) {
                const jsonMockResponse = JSON.parse(result[0].jsonMockResp || "[]");
                setMockInterviewQuestions(jsonMockResponse);
                setInterviewDetails(result[0]);
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    useEffect(() => {
        if (!interviewId) return;
        getInterviewDetails();
    }, [interviewId]);

    return (
        <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <QuestionSection
                    InterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                />
                <RecordAnswerSection
                    InterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewDetails={interviewDetails}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div></div>
                <div className="flex justify-evenly">
                    {activeQuestionIndex > 0 && (
                        <button
                            type="button"
                            className="btn btn-ghost hover:bg-cyan-100 hover:border-cyan-500"
                            onClick={() => setActiveQuestionIndex((prev) => prev - 1)}
                        >
                            Previous Question
                        </button>
                    )}
                    {activeQuestionIndex < mockInterviewQuestions.length - 1 && (
                        <button
                            type="button"
                            className="btn btn-ghost hover:bg-cyan-100 hover:border-cyan-500"
                            onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                        >
                            Next Question
                        </button>
                    )}
                    {activeQuestionIndex === mockInterviewQuestions.length - 1 && interviewDetails && (
                        <Link href={`/dashboard/interview/${interviewDetails.mockId}/feedback`}>
                            <button type="button" className="btn btn-ghost hover:bg-cyan-100 hover:border-cyan-500">
                                End Interview
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StartInterview;
