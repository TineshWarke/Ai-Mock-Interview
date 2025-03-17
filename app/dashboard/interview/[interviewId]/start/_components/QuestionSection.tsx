import Image from 'next/image';
import React from 'react';

interface QuestionSectionProps {
    InterviewQuestions: { Question: string; Answer: string }[] | null;
    activeQuestionIndex: number;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({ InterviewQuestions, activeQuestionIndex }) => {
    const textToSpeech = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any ongoing speech
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert("Sorry, your browser does not support text-to-speech.");
        }
    };

    return (
        <div className="p-5 border border-gray-300 rounded-lg m-10 mb-0">
            {/* Question Index Grid */}
            {InterviewQuestions && InterviewQuestions.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {InterviewQuestions.map((_, index) => (
                        <div key={index}>
                            <h2
                                className={`px-3 btn hover:bg-cyan-100 hover:border-cyan-500 rounded-full text-center text-xs md:text-sm cursor-pointer
                                    ${activeQuestionIndex === index ? 'bg-cyan-100 border-cyan-500' : ''}`}
                                aria-label={`Question ${index + 1}`}
                            >
                                Question #{index + 1}
                            </h2>
                        </div>
                    ))}
                </div>
            ) : (
                <h2 className="my-5 flex justify-center text-gray-500">Loading Questions...</h2>
            )}

            {/* Active Question Display */}
            <div>
                {InterviewQuestions && InterviewQuestions[activeQuestionIndex] ? (
                    <>
                        <h2 className="my-2 mt-5 text-justify">
                            {InterviewQuestions[activeQuestionIndex].Question}
                        </h2>
                        <div
                            onClick={() => textToSpeech(InterviewQuestions[activeQuestionIndex].Question)}
                            className="cursor-pointer hover:bg-gray-300 w-fit p-2 rounded-full"
                            aria-label="Play question text"
                        >
                            <Image src="/volume-up.png" height={18} width={18} alt="Play question" />
                        </div>
                    </>
                ) : (
                    <h2 className="my-5 flex justify-center text-gray-500"> No Questions Available </h2>
                )}

                {/* Note Section */}
                <div className="my-5 p-5 border border-blue-300 rounded-lg bg-blue-100 mt-10">
                    <div className="flex items-center gap-2">
                        <Image src="/lightbulb.png" height={18} width={18} alt="Info" />
                        <h2 className="text-blue-500 font-semibold">Note</h2>
                    </div>
                    <h2 className="text-justify mt-3 text-blue-800">
                        {process.env.NEXT_PUBLIC_QUESTION_NOTE || "No additional notes available."}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default QuestionSection;
