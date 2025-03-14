'use client';
import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAiModel';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AddNewInterview: React.FC = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [jobPosition, setJobPosition] = useState<string>('');
    const [jobDesc, setJobDesc] = useState<string>('');
    const [jobExperience, setJobExperience] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [jsonResponse, setJsonResponse] = useState<string>();
    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();

        const InputPrompt: String = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}, Depending upon this information give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT} interview Questions answered in JSON format, Give Question and Answer as a field in JSON `;

        const result = await chatSession.sendMessage(InputPrompt);
        let MockJsonResp: string = await result.response.text();

        MockJsonResp = MockJsonResp.replace(/```json|```/g, '').trim();
        MockJsonResp = MockJsonResp.replace(/[\x00-\x1F\x7F]/g, '');

        setJsonResponse(MockJsonResp);
        // const parsedResponse = JSON.parse(MockJsonResp);

        if (MockJsonResp) {
            const response = await db.insert(MockInterview)
                .values({
                    mockId: uuidv4(),
                    // jsonMockResp: parsedResponse,
                    jsonMockResp: MockJsonResp ?? '',
                    jobPosition: jobPosition ?? '',
                    jobDesc: jobDesc ?? '',
                    jobExperience: jobExperience ?? '',
                    createdBy: user?.primaryEmailAddress?.emailAddress ?? '',
                    createdAt: moment().format('YYYY-MM-DD')
                }).returning({ mockId: MockInterview.mockId });

            // console.log("Inserted ID : ", response);
            if (response) {
                setOpenDialog(false);
                router.push(`/dashboard/interview/${response[0]?.mockId}`);
            }
        } else {
            console.log("ERROR");
        }

        setLoading(false);
    };

    return (
        <div>
            <div
                className='p-10 border rounded-lg bg-gray-100 hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}
            >
                <h2 className='font-bold text-lg text-center'>+ Add New</h2>
            </div>

            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle" open={openDialog}>
                <div className="modal-box">
                    <form onSubmit={onSubmit}>
                        <div>
                            <h2 className='text-2xl'>Tell us more about your job interview</h2>
                            <h2>Add details about your job position/role, job description and year of experience</h2>

                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Job Position/Role</legend>
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="Ex. Full Stack Developer"
                                    required
                                    value={jobPosition}
                                    onChange={(event) => setJobPosition(event.target.value)}
                                />

                                <legend className="fieldset-legend">Job Description/ Tech Stack (In Short)</legend>
                                <textarea
                                    className="textarea h-24 w-full"
                                    placeholder="Ex. React, Node.js, MongoDB etc"
                                    required
                                    value={jobDesc}
                                    onChange={(event) => setJobDesc(event.target.value)}
                                />

                                <legend className="fieldset-legend">Years of Experience</legend>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="Ex. 5"
                                    min={0}
                                    max={50}
                                    required
                                    value={jobExperience}
                                    onChange={(event) => setJobExperience(event.target.value)}
                                />
                            </fieldset>
                        </div>
                        <div className="flex gap-5 justify-end">
                            <button
                                type='button'
                                className="btn btn-ghost"
                                onClick={() => setOpenDialog(false)}
                            >
                                Cancel
                            </button>
                            <button type='submit' className="btn" disabled={loading}>
                                {loading ? <><span className="loading loading-dots loading-md" /> Genereating from AI</>
                                    : 'Start Interview'
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default AddNewInterview;
