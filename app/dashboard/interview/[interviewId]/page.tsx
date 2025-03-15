'use client'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';

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

const Interview: React.FC = () => {
    const params = useParams();
    const interviewId = params?.interviewId as string;
    const [interviewDetails, setInterviewDetails] = useState<Interview>();
    const [webCamEnabled, setWebCamEnabled] = useState<boolean>(false);

    const getInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, interviewId));

            setInterviewDetails(result[0] || {}); // Ensures it doesn't set undefined
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    useEffect(() => {
        getInterviewDetails();
    }, [getInterviewDetails]);


    return (
        <div className='my-10 flex flex-col justify-center items-center px-5 md:px-10'>
            <h2 className='font-bold text-2xl text-center text-cyan-500'>Let's Get Started</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 w-full'>
                {/* Interview Details */}
                <div className='my-7'>
                    <div className='flex flex-col gap-5 p-5 border rounded-lg shadow-sm'>
                        <h2 className='text-lg'><strong>Job Role/ Position:</strong> {interviewDetails?.jobPosition}</h2>
                        <h2 className='text-lg text-justify'><strong>Job Description/ Tech Stack:</strong> {interviewDetails?.jobDesc}</h2>
                        <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewDetails?.jobExperience}</h2>
                    </div>

                    {/* Information Box */}
                    <div className='my-5 p-5 border border-yellow-300 rounded-lg bg-yellow-100'>
                        <div className='flex items-center gap-2'>
                            <Image src={'/lightbulb.png'} height={18} width={18} alt='bulb' />
                            <h2 className='text-yellow-500 font-semibold'>Information</h2>
                        </div>
                        <h2 className='text-justify mt-3 text-yellow-800'>
                            {process.env.NEXT_PUBLIC_INFORMATION ?? "No additional information available."}
                        </h2>
                    </div>
                </div>

                {/* Webcam Section */}
                <div className='flex flex-col items-center'>
                    {webCamEnabled ? (
                        <div className='flex justify-center'>
                            <Webcam
                                onUserMediaError={() => setWebCamEnabled(false)}
                                mirrored={true}
                                style={{ height: 300, width: 300 }}
                            />
                        </div>
                    ) : (
                        <>
                            <div className='p-20 bg-gray-100 border rounded-lg my-7 w-full flex justify-center'>
                                <Image src={'/webcam.png'} width={72} height={72} alt='Webcam' />
                            </div>
                            <button type='button' className="btn w-full btn-ghost" onClick={() => setWebCamEnabled(true)}>
                                Enable Webcam and Microphone
                            </button>
                        </>
                    )}
                    <div className='mt-5 flex justify-end w-full'>
                        <Link href={`/dashboard/interview/${interviewId}/start`}>
                            <button type='button' className="btn w-64 hover:bg-cyan-100 border-cyan-500">Start</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Interview;
