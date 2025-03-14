'use client'
import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAiModel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react'

interface QuestionSectionProps {
    InterviewQuestions: { Question: string; Answer: string }[] | null;
    activeQuestionIndex: number;
    interviewDetails: any
}

const RecordAnswerSection: React.FC<QuestionSectionProps> = ({ InterviewQuestions, activeQuestionIndex, interviewDetails }) => {
    const [userAnswer, setUserAswer] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useUser();

    const saveUserAnswer = async () => {
        if (InterviewQuestions) {
            const feedbackPrompt: string = `Question: ${InterviewQuestions[activeQuestionIndex]?.Question}, User Answer: ${userAnswer}, Depends on question and user answer for given interview question, please give us rating out of 10 and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field`;

            try {
                setLoading(true);
                const result = await chatSession.sendMessage(feedbackPrompt);
                let MockJsonResp: string = await result.response.text();

                MockJsonResp = MockJsonResp.replace(/```json|```/g, '').trim();
                MockJsonResp = MockJsonResp.replace(/[\x00-\x1F\x7F]/g, '');

                let jsonFeedback;
                try {
                    jsonFeedback = JSON.parse(MockJsonResp);
                } catch (error) {
                    console.error("Error parsing AI response:", error);
                    jsonFeedback = { feedback: "Invalid response", rating: "N/A" };
                }

                if (!InterviewQuestions[activeQuestionIndex]) {
                    throw new Error("Invalid question index");
                }

                const response = await db.insert(UserAnswer).values({
                    mockIdRef: interviewDetails.mockId,
                    question: InterviewQuestions[activeQuestionIndex]?.Question,
                    correctAns: InterviewQuestions[activeQuestionIndex]?.Answer,
                    userAns: userAnswer || "",
                    feedback: jsonFeedback?.feedback || "No feedback available",
                    rating: jsonFeedback?.rating || "Unrated",
                    userEmail: user?.primaryEmailAddress?.emailAddress || "unknown",
                    createdAt: new Date().toISOString(),
                });

                setUserAswer('');
                // console.log("Inserted ID : ", response);
                // console.log("Data inserted successfully:", response);
            } catch (error) {
                console.error("Error inserting user answer:", error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log('Error while saving your answer, please try again');
        }
    }

    useEffect(() => {
        setUserAswer('');
    }, [activeQuestionIndex])

    return (
        <div className='flex flex-col items-center justify-center'>
            <textarea className="textarea h-80 max-h-80 w-full justify-center items-center rounded-lg p-5 my-10"
                placeholder="Write your answer here...." value={userAnswer}
                onChange={(event) => setUserAswer(event.target.value)} />

            <button type='button' className='btn' onClick={saveUserAnswer} disabled={loading}>
                {loading ? <><span className="loading loading-dots loading-md" /> Loading...</>
                    : 'Save Answer'
                }</button>
        </div>
    )
}

export default RecordAnswerSection
