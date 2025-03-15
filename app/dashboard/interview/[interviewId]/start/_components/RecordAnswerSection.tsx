'use client';
import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAiModel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState, useCallback } from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';

interface QuestionSectionProps {
    InterviewQuestions: { Question: string; Answer: string }[] | null;
    activeQuestionIndex: number;
    interviewDetails: any;
}

const RecordAnswerSection: React.FC<QuestionSectionProps> = ({ InterviewQuestions, activeQuestionIndex, interviewDetails }) => {
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useUser();

    const saveUserAnswer = useCallback(async () => {
        if (!InterviewQuestions || !InterviewQuestions[activeQuestionIndex]) {
            console.error("Invalid question data.");
            return;
        }
        if (!userAnswer.trim()) {
            toast.warn("Please write an answer before submitting.")
            return;
        }

        const feedbackPrompt = `Question: ${InterviewQuestions[activeQuestionIndex].Question}, 
            User Answer: ${userAnswer}. Please provide a rating (out of 10) and a brief (3-5 lines) feedback 
            on areas of improvement. Response should be in JSON format with 'rating' and 'feedback' fields.`;

        try {
            setLoading(true);
            const result = await chatSession.sendMessage(feedbackPrompt);
            let aiResponseText = await result.response.text();

            // Cleaning AI response for safe JSON parsing
            aiResponseText = aiResponseText.replace(/```json|```/g, '').trim().replace(/[\x00-\x1F\x7F]/g, '');

            let jsonFeedback;
            try {
                jsonFeedback = JSON.parse(aiResponseText);
                if (!jsonFeedback.feedback || !jsonFeedback.rating) {
                    console.log("Invalid AI response structure");
                }
            } catch (error) {
                console.error("Error parsing AI response:", error);
                jsonFeedback = { feedback: "AI response could not be processed.", rating: "N/A" };
            }

            await db.insert(UserAnswer).values({
                mockIdRef: interviewDetails.mockId,
                question: InterviewQuestions[activeQuestionIndex].Question,
                correctAns: InterviewQuestions[activeQuestionIndex].Answer,
                userAns: userAnswer,
                feedback: jsonFeedback.feedback || "No feedback available",
                rating: jsonFeedback.rating || "Unrated",
                userEmail: user?.primaryEmailAddress?.emailAddress || "unknown",
                createdAt: new Date().toISOString(),
            });

            setUserAnswer('');
            toast.success("Your answer has been saved successfully.");
        } catch (error) {
            console.error("Error saving user answer:", error);
            toast.error("An error occurred while saving your answer. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [InterviewQuestions, activeQuestionIndex, userAnswer, interviewDetails, user]);

    useEffect(() => {
        setUserAnswer('');
    }, [activeQuestionIndex]);

    return (
        <div className="flex flex-col items-center justify-center">
            <textarea
                className="textarea h-80 max-h-80 w-full rounded-lg p-5 my-10"
                placeholder="Write your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                aria-label="User answer input"
            />
            <button
                type="button"
                className={`btn ${!loading ? 'bg-cyan-50 border-cyan-500' : ''} hover:bg-cyan-200 `}
                onClick={saveUserAnswer}
                disabled={loading}
                aria-label="Save answer button"
            >
                {loading ? (
                    <>
                        <span className="loading loading-dots loading-md text-cyan-500" /> <span className='text-cyan-500'> Saving... </span>
                    </>
                ) : (
                    "Save Answer"
                )}
            </button>

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    );
};

export default RecordAnswerSection;
