'use client';

import Link from 'next/link';
import React from 'react';

const steps = [
  {
    title: "Sign Up & Log In",
    description: "Create an account and log in to access mock interview features.",
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )
  },
  {
    title: "Start a Mock Interview",
    description: "Select your job role and experience level to start an AI-powered mock interview.",
    icon: (
      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-6.518-3.76A1 1 0 007 8.07v7.86a1 1 0 001.234.98l6.518-3.76a1 1 0 000-1.74z" />
      </svg>
    )
  },
  {
    title: "Answer Questions",
    description: "Respond to technical and behavioral questions based on your selection.",
    icon: (
      <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8M8 12h6m-6-4h8M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0z" />
      </svg>
    )
  },
  {
    title: "Get Instant Feedback",
    description: "Receive AI-driven feedback with ratings and suggestions for improvement.",
    icon: (
      <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 17l-3.5 2.09.75-4.36-3.16-3.09 4.38-.64L12 6l1.94 3.96 4.38.64-3.16 3.09.75 4.36z" />
      </svg>
    )
  }
];

const HowItWorks = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-cyan-600 mb-6">How It Works</h2>

      {/* Step Progress Bar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-4/5 h-2 bg-gray-300 rounded-full">
          <div className="absolute top-0 left-0 h-2 bg-cyan-500 rounded-full transition-all duration-500 w-full"></div>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="border rounded-lg shadow-md p-5 text-center bg-white transition-transform duration-200 hover:scale-105 hover:shadow-lg"
          >
            <div className="mb-3 flex justify-center">
              {step.icon}
            </div>
            <span className="text-lg font-bold text-gray-700 bg-blue-100 px-3 py-1 rounded-full">
              Step {index + 1}
            </span>
            <h3 className="font-semibold text-lg mt-2">{step.title}</h3>
            <p className="text-gray-600 text-sm mt-2 text-balance">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Extra Visual Content */}
      <div className="mt-12 flex flex-col items-center">
        <p className="text-gray-500 text-center text-sm mt-4">
          Prepare for real-world job interviews with AI-powered mock interviews.
        </p>
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href="/dashboard"
          className="btn btn-outline border-cyan-800 text-cyan-800 font-semibold px-6 py-3 rounded-lg shadow-md hover:scale-105 hover:bg-white transition-all"
        >
          Start Your Mock Interview 🚀
        </Link>
      </div>
    </div>
  );
};

export default HowItWorks;
