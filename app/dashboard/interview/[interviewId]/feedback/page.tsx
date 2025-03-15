'use client';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';

interface InterviewFeedback {
  id: number;
  mockIdRef: string;
  question: string;
  correctAns: string;
  userAns: string;
  feedback: string;
  rating: string;
  userEmail: string;
  createdAt: string;
}

const Feedback = () => {
  const params = useParams();
  const interviewId = params?.interviewId as string;
  const [feedbackList, setFeedbackList] = useState<InterviewFeedback[]>([]);
  const router = useRouter();

  const getFeedback = useCallback(async () => {
    if (!interviewId) return;
    try {
      const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id);

      setFeedbackList(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  }, [interviewId]);

  useEffect(() => {
    getFeedback();
  }, [getFeedback]);

  const averageRating = useMemo(() => {
    const ratings = feedbackList.map(item => Number(item.rating));
    const validRatings = ratings.filter(r => !isNaN(r));

    return validRatings.length > 0
      ? Math.floor(validRatings.reduce((a, b) => a + b, 0) / ratings.length)
      : 0;
  }, [feedbackList]);

  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl text-green-500">Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
      <h3 className="text-blue-500 text-lg my-3">
        Your overall interview rating: <strong>{averageRating}/10</strong>
      </h3>
      <p className="text-sm text-gray-500">
        Below are the interview questions with correct answers, your responses, and feedback for improvement.
      </p>

      {feedbackList.length > 0 ? (
        feedbackList.map((item, index) => (
          <div className="collapse collapse-arrow bg-base-100 border border-cyan-500 my-2" key={index}>
            <input type="checkbox" />
            <div className="collapse-title font-semibold text-justify">{item.question}</div>
            <div className="collapse-content text-sm max-w-full">
              <h3
                className={`p-2 ${isNaN(Number(item.rating)) || Number(item.rating) <= 4
                  ? 'text-red-500'
                  : Number(item.rating) <= 7
                    ? 'text-yellow-500'
                    : 'text-green-500'
                  }`}
              >
                <strong>Rating:</strong> {!isNaN(Number(item.rating)) ? item.rating : 0}
              </h3>
              <pre className="bg-red-100 text-red-500 p-2 rounded-lg my-2 whitespace-pre-wrap text-justify">
                <strong>Your Answer:</strong> {item.userAns}
              </pre>
              <pre className="bg-green-100 text-green-500 p-2 rounded-lg whitespace-pre-wrap text-justify">
                <strong>Correct Answer:</strong> {item.correctAns}
              </pre>
              <h3 className="bg-blue-100 text-blue-500 p-2 rounded-lg my-2 text-justify">
                <strong>Feedback:</strong> {item.feedback}
              </h3>
            </div>
          </div>
        ))
      ) : (
        <h3>Loading...</h3>
      )}

      <div className="mt-5 flex justify-end">
        <button type="button" className="btn w-64 hover:bg-cyan-100 hover:border-cyan-500" onClick={() => router.replace('/dashboard')}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default Feedback;
