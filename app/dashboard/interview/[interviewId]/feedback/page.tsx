'use client'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Feedback = () => {
  const params = useParams();
  const interviewId = params?.interviewId as string;
  const [feedbackList, setFeedbackList] = useState<any>();
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);

  const getFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackList(result);
    const ratings = result.map(item => Number(item.rating));

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    setRating(Math.floor(averageRating));

  }

  useEffect(() => {
    getFeedback();
  }, [])

  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl text-green-500'>Congratulation!</h2>
      <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
      <h2 className='text-blue-500 text-lg my-3'>Your overall interview rating: <strong> {rating}/10</strong></h2>

      <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, your answer and feedback for improvement</h2>

      {
        feedbackList ? feedbackList.map((item: any, index: number) =>
          <div className="collapse collapse-arrow bg-base-100 border-base-300 border my-2" key={index}>
            <input type="checkbox" />
            <div className="collapse-title font-semibold text-justify">{item.question}</div>
            <div className="collapse-content text-sm max-w-full">
              <h2 className={`${item.rating <= 4 ? 'text-red-500' : item.rating <= 7 ? 'text-yellow-500' : 'text-green-500'} p-2`}><strong>Rating:</strong> {item.rating}</h2>
              <pre className='bg-red-100 text-red-500 p-2 rounded-lg my-2 whitespace-pre-wrap text-justify'><strong>Your Answer:</strong> {item.userAns}</pre>
              <pre className='bg-green-100 text-green-500 p-2 rounded-lg whitespace-pre-wrap text-justify'><strong>Correct Answer:</strong> {item.correctAns}</pre>
              <h2 className='bg-blue-100 text-blue-500 p-2 rounded-lg my-2 text-justify'><strong>Feedback:</strong> {item.feedback}</h2>
            </div>
          </div>
        ) : <h2>Loading...</h2>}

      <div className='mt-5 flex justify-end'>
        <button type='button' className="btn w-64 " onClick={() => router.replace('/dashboard')}>Go Home</button>
      </div>
    </div>
  )
}

export default Feedback
