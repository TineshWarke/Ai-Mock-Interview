import Image from 'next/image';
import React from 'react';

interface QuestionSectionProps {
    InterviewQuestions: { Question: string; Answer: string }[] | null;
    activeQuestionIndex: number;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({ InterviewQuestions, activeQuestionIndex }) => {
    const textToSpeach = (text: string) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert("Sorry, Your browser does not support text to speech");
        }
    }

    return (
        <div className='p-5 border border-gray-300 rounded-lg m-10 mb-0'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {InterviewQuestions && (
                    InterviewQuestions.map((question, index) => (
                        <div key={index} >
                            <h2 className={`p-2 bg-gray-100 rounded-full text-center text-xs md:text-sm cursor-pointer
                                ${activeQuestionIndex === index && 'bg-gray-600 text-white'}`}>
                                Question #{index + 1}
                            </h2>
                        </div>
                    ))
                )}
            </div>

            <div>
                {InterviewQuestions ?
                    <>
                        <h2 className='my-2 mt-5 text-justify'>text{InterviewQuestions[activeQuestionIndex]?.Question}</h2>
                        <div onClick={() => textToSpeach(InterviewQuestions[activeQuestionIndex]?.Question)}
                            className='cursor-pointer hover:bg-gray-300 w-fit p-2 rounded-full'>
                            <Image src={'/volume-up.png'} height={18} width={18} alt='bulb' />
                        </div>
                    </>
                    : <h2 className='my-5 flex justify-center'> Loading Question... </h2>
                }
                <div className='my-5 p-5 border border-blue-300 rounded-lg bg-blue-100 mt-10'>
                    <div className='flex items-center gap-2'>
                        <Image src={'/lightbulb.png'} height={18} width={18} alt='bulb' />
                        <h2 className='text-blue-500'><strong>Note</strong></h2>
                    </div>
                    <h2 className='text-justify mt-3 text-blue-800'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
                </div>
            </div>
        </div>
    );
};

export default QuestionSection;

