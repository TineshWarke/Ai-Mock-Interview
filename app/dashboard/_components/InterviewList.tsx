'use client';

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';

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

const InterviewList = () => {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState<Interview[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchInterviews = async () => {
            try {
                const email = user.primaryEmailAddress?.emailAddress;
                if (!email) return;

                const result = await db
                    .select()
                    .from(MockInterview)
                    .where(eq(MockInterview.createdBy, email))
                    .orderBy(desc(MockInterview.id));

                setInterviewList(result);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            }
        };

        fetchInterviews();
    }, [user]);

    return (
        <div>
            <h2 className="text-xl font-medium">Previous Mock Interviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
                {interviewList.length > 0 ? (
                    interviewList.map((interview) => (
                        <InterviewItemCard key={interview.mockId} interview={interview} />
                    ))
                ) : (
                    <p className="text-gray-500">No interviews found.</p>
                )}
            </div>
        </div>
    );
};

export default InterviewList;
