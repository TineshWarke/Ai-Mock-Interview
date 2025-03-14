'use client'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'

const Interview: React.FC = () => {
    const params = useParams();
    const interviewId = params?.interviewId as string;
    const [interviewDetails, setInterviewDetails] = useState<any>(null);
    const [webCamEnebled, setWebCamEnebled] = useState<boolean>(false);

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId));

        setInterviewDetails(result[0]);
    }

    useEffect(() => {
        if (!interviewId) return;
        getInterviewDetails();
    }, []);

    return (
        <div className='my-10 flex flex-col justify-center items-center'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='my-7'>
                    <div className='flex flex-col gap-5 p-5 border rounded-lg'>
                        <h2 className='text-lg'><strong> Job Role/ Position : </strong> {interviewDetails?.jobPosition}</h2>
                        <h2 className='text-lg text-justify'><strong> Job Description/ Tech Stack : </strong> {interviewDetails?.jobDesc}</h2>
                        <h2 className='text-lg'><strong> Years of Experience : </strong> {interviewDetails?.jobExperience}</h2>
                    </div>

                    <div className='my-5 p-5 border border-yellow-300 rounded-lg bg-yellow-100'>
                        <div className='flex items-center gap-2'>
                            <Image src={'/lightbulb.png'} height={18} width={18} alt='bulb' />
                            <h2 className='text-yellow-500'><strong>Information</strong></h2>
                        </div>
                        <h2 className='text-justify mt-3 text-yellow-800'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
                </div>

                <div className='item-center'>
                    {
                        webCamEnebled
                            ? <div className='flex justify-center'>
                                <Webcam
                                    onUserMedia={() => setWebCamEnebled(true)}
                                    onUserMediaError={() => setWebCamEnebled(false)}
                                    mirrored={true}
                                    style={{
                                        height: 300,
                                        width: 300
                                    }} />
                            </div>
                            :
                            <>
                                <div className='p-20 bg-gray-100 border rounded-lg my-7 w-full flex justify-center'>
                                    <Image src={'/webcam.png'} width={72} height={72} alt='Webcam' />
                                </div>
                                <button type='button' className="btn w-full btn-ghost" onClick={() => setWebCamEnebled(true)}>
                                    Eneble Webcam and Microphone
                                </button>

                            </>
                    }
                    <div className='mt-5 flex justify-end'>
                        <Link href={`/dashboard/interview/${interviewId}/start`}>
                            <button type='button' className="btn w-64 ">Start</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Interview;