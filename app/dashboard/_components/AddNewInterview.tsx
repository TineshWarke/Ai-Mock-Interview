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
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const InputPrompt: string = `Generate interview questions and answers in JSON format based on the following details: 
                                        Job Position: ${jobPosition}, Job Description: ${jobDesc}, and Years of Experience: ${jobExperience}. 
                                        The number of questions should be ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT}. 

                                        Return the JSON as a **flat array**, without any additional nesting. The format should be:

                                        [
                                        {
                                            "Question": "Explain the concept of closures in JavaScript.",
                                            "Answer": "A closure is a function that retains access to its lexical scope..."
                                        },
                                        {
                                            "Question": "What are the key principles of SOLID design?",
                                            "Answer": "The SOLID principles stand for: 1. Single Responsibility Principle..."
                                        }
                                        ]

                                        Ensure that the fields are capitalized exactly as 'Question' and 'Answer' (without any additional parent objects like "interview_questions").`;

        try {
            const result = await chatSession.sendMessage(InputPrompt);
            let MockJsonResp: string = await result.response.text();

            MockJsonResp = MockJsonResp.replace(/```json|```/g, '').trim();
            MockJsonResp = MockJsonResp.replace(/[\x00-\x1F\x7F]/g, '');

            if (MockJsonResp) {
                const response = await db.insert(MockInterview)
                    .values({
                        mockId: uuidv4(),
                        jsonMockResp: MockJsonResp,
                        jobPosition: jobPosition.trim(),
                        jobDesc: jobDesc.trim(),
                        jobExperience: jobExperience.trim(),
                        createdBy: user?.primaryEmailAddress?.emailAddress || '',
                        createdAt: moment().format('YYYY-MM-DD'),
                    })
                    .returning({ mockId: MockInterview.mockId });

                if (response.length > 0) {
                    setOpenDialog(false);
                    router.push(`/dashboard/interview/${response[0].mockId}`);
                }
            } else {
                console.error("Error: Empty AI response");
            }
        } catch (error) {
            console.error("Submission failed:", error);
        }

        setLoading(false);
    };

    return (
        <div>
            <div
                className="p-4 md:p-10 border rounded-lg bg-gray-100 hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                onClick={() => setOpenDialog(true)}
            >
                <h2 className="font-bold text-lg text-center">+ Add New</h2>
            </div>

            {openDialog && (
                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle" open>
                    <div className="modal-box">
                        <form onSubmit={onSubmit}>
                            <h2 className="text-2xl">Tell us more about your job interview</h2>
                            <h2>Add details about your job position, job description, and years of experience.</h2>

                            <div className="mt-4">
                                <label className="font-semibold">Job Position/Role</label>
                                <input
                                    type="text"
                                    className="input w-full mt-1"
                                    placeholder="Ex. Full Stack Developer"
                                    required
                                    value={jobPosition}
                                    onChange={(e) => setJobPosition(e.target.value)}
                                />
                            </div>

                            <div className="mt-4">
                                <label className="font-semibold">Job Description/Tech Stack (In Short)</label>
                                <textarea
                                    className="textarea h-24 w-full mt-1"
                                    placeholder="Ex. React, Node.js, MongoDB etc."
                                    required
                                    value={jobDesc}
                                    onChange={(e) => setJobDesc(e.target.value)}
                                />
                            </div>

                            <div className="mt-4">
                                <label className="font-semibold">Years of Experience</label>
                                <input
                                    type="number"
                                    className="input w-full mt-1"
                                    placeholder="Ex. 5"
                                    min={0}
                                    max={50}
                                    required
                                    value={jobExperience}
                                    onChange={(e) => setJobExperience(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-5 justify-end mt-5">
                                <button type="button" className="btn btn-ghost hover:bg-red-100 hover:border-red-500" onClick={() => setOpenDialog(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn w-full sm:w-auto hover:bg-cyan-100 hover:border-cyan-500" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="loading loading-dots loading-md text-cyan-500" /> <span className='text-cyan-500'>Generating from AI</span>
                                        </>
                                    ) : (
                                        'Start Interview'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default AddNewInterview;
