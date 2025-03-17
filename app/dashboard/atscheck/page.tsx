'use client'
import { chatSession } from '@/utils/GeminiAiModel';
import React, { useState } from 'react'
import { Bounce, toast, ToastContainer } from 'react-toastify';

interface Response {
    ATS_Score: number,
    Strengths: string[],
    Improvement_Areas: string[],
    Missing_Keywords: string[],
    Formatting_Issues: string[],
    ATS_Red_Flags: string[],
    Bullet_Point_Quality: { Action_Oriented: boolean, Concise: boolean, Uses_Metrics: boolean },
    Measurable_Achievements: string[],
    Overall_Resume_Strength: string,
    Final_Verdict: string
}

const ATSCheck = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [response, setResponse] = useState<Response | string | null>(null);
    const [loading, setLoading] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const convertFileToBase64 = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).split(",")[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            toast.error('Please upload a PDF file.');
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!pdfFile) {
            alert("Please upload a PDF resume.");
            return;
        }
        setLoading(true);

        try {
            const base64Resume = await convertFileToBase64(pdfFile);

            const InputPrompt: string = `Analyze this resume for ATS (Applicant Tracking System) compatibility and assign a score from 1 to 100 based on its likelihood of passing automated screening for a software engineering or product-based company role. Your evaluation should be **comprehensive** and **data-driven**, ensuring that the resume is optimized for both **ATS parsing** and **human recruiters**.  

### **Evaluation Criteria:**  
1. **Keyword Match**: Analyze how well the resume aligns with the skills, technologies, and experience listed in the job description. Identify missing or underutilized keywords.  
2. **Formatting & Structure**: Evaluate whether the resume follows ATS-friendly formatting (e.g., clear section headings, standard fonts, proper bullet points, no complex tables, columns, or images).  
3. **Readability & Clarity**: Assess whether the content is clear, concise, and uses **strong action verbs** while avoiding redundancy, filler words, or vague descriptions.  
4. **Technical & Soft Skills Balance**: Determine whether the resume effectively highlights both **technical expertise** (e.g., programming languages, frameworks) and **soft skills** (e.g., leadership, communication, problem-solving).  
5. **Experience & Project Relevance**: Analyze how well the candidate’s **work experience, personal projects, and achievements** align with the job requirements.  
6. **ATS Red Flags**: Identify potential issues that could hinder ATS parsing, such as excessive use of graphics, tables, multi-column layouts, missing section headings, or non-standard fonts.  
7. **Bullet Points & Action Verbs**: Check if the resume uses **concise bullet points** with strong action verbs instead of long paragraphs.  
8. **Measurable Achievements**: Evaluate whether the resume includes **quantifiable metrics** (e.g., improved system efficiency by 30%, reduced latency by 40ms) instead of generic descriptions.  
9. **Overall Resume Strength**: Provide a qualitative assessment of how well the resume is structured for **both ATS and human review**, identifying areas of improvement.  

### **Job Description:**  
${jobDescription}  

### **Response Format:**  
\`\`\`json
{
    "ATS_Score": 85,
    "Strengths": ["Strong alignment with required technologies", "ATS-friendly format", "Concise content", "Uses action verbs effectively"],
    "Improvement_Areas": ["Increase keyword density", "Enhance readability", "Add measurable achievements"],
    "Missing_Keywords": ["GraphQL", "Microservices", "Cloud Computing"],
    "Formatting_Issues": ["Uses two-column layout", "Some headings unclear"],
    "ATS_Red_Flags": ["Non-standard font", "Embedded images", "Excessive tables"],
    "Bullet_Point_Quality": { "Action_Oriented": true, "Concise": true, "Uses_Metrics": false },
    "Measurable_Achievements": ["No quantifiable results found", "Projects need performance metrics"],
    "Overall_Resume_Strength": "The resume is well-structured but needs keyword optimization, formatting fixes, and measurable achievements.",
    "Final_Verdict": "Moderate chance of passing ATS screening; recommended improvements."
}
\`\`\`
`;

            const result = await chatSession.sendMessage([
                { text: InputPrompt },
                { inlineData: { mimeType: "application/pdf", data: base64Resume } }
            ]);

            const responseText = await result.response.text();

            // Extract JSON content by removing any markdown-style code block
            const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
            const cleanJson = jsonMatch ? jsonMatch[1] : responseText;

            try {
                const parsedResponse = JSON.parse(cleanJson);
                setResponse(parsedResponse);
            } catch (error) {
                console.error("Error parsing AI response:", error);
                setResponse("Error: Failed to parse ATS evaluation, Try again....");
            }
        } catch (error) {
            console.error("Error:", error);
            setResponse("Failed to get ATS evaluation, Try again....");
        }

        setLoading(false);
    };

    return (
        <div className="p-6 md:p-10">
            <h1 className='font-bold text-2xl text-cyan-500'>Resume Score Analyzer</h1>

            <div className='my-5'>
                <form onSubmit={onSubmit}>
                    <input type="file" accept="application/pdf" onChange={handleFileUpload} required
                        className="p-4 md:p-10 border rounded-lg bg-gray-100 hover:scale-105 hover:shadow-md cursor-pointer transition-all" />

                    <div className="mt-4">
                        <label className="font-semibold">Job Description</label>
                        <textarea
                            className="textarea h-24 w-full mt-1"
                            placeholder="Paste the job description"
                            required
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-5 justify-end mt-5">
                        <button type="submit" className="btn w-full sm:w-auto hover:bg-cyan-100 hover:border-cyan-500" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="loading loading-dots loading-md text-cyan-500" /> <span className='text-cyan-500'>Evaluating...</span>
                                </>
                            ) : (
                                'Evaluate ATS Score'
                            )}
                        </button>
                    </div>
                </form>

                {response && (typeof response !== "string" ? (
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50 shadow-md">
                        <h2 className="text-xl font-semibold text-cyan-600">ATS Evaluation Results</h2>
                        <p className="text-lg font-bold mt-2">ATS Score: {' '}
                            <span className={`${response.ATS_Score >= 80 ? 'text-green-600' : response.ATS_Score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {response.ATS_Score}/100
                            </span></p>

                        <div className="mt-3">
                            <h3 className="font-bold">Strengths:</h3>
                            <ul className="list-disc ml-5">
                                {response.Strengths?.map((item: string, index: number) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>

                        <div className="mt-3">
                            <h3 className="font-bold">Areas for Improvement:</h3>
                            <ul className="list-disc ml-5">
                                {response.Improvement_Areas?.map((item: string, index: number) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>

                        <div className="mt-3">
                            <h3 className="font-bold">Missing Keywords:</h3>
                            <ul className="list-disc ml-5">
                                {response.Missing_Keywords?.map((item: string, index: number) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>

                        <div className="mt-3">
                            <h3 className="font-bold">Formatting Issues:</h3>
                            <ul className="list-disc ml-5">
                                {response.Formatting_Issues?.map((item: string, index: number) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>

                        <div className="mt-3">
                            <h3 className="font-bold">ATS Red Flags:</h3>
                            <ul className="list-disc ml-5">
                                {response.ATS_Red_Flags?.map((item: string, index: number) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>

                        <div className="mt-3">
                            <h3 className="font-bold">Bullet Point Quality:</h3>
                            <ul className="list-disc ml-5">
                                <li>Action_Oriented: {response.Bullet_Point_Quality.Action_Oriented ? '✅' : '❌'}</li>
                                <li>Concise: {response.Bullet_Point_Quality.Concise ? '✅' : '❌'}</li>
                                <li>Uses_Metrics: {response.Bullet_Point_Quality.Uses_Metrics ? '✅' : '❌'}</li>
                            </ul>
                        </div>

                        <div className="mt-3">
                            <h3 className="font-bold">Measurable Achievements:</h3>
                            <ul className="list-disc ml-5">
                                {response.Measurable_Achievements?.map((item: string, index: number) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>

                        <p className="mt-3 font-bold">Overall Resume Strength: <span className="text-green-600">{response.Overall_Resume_Strength}</span></p>

                        <p className="mt-3 font-bold">Final Verdict: <span className="text-red-600">{response.Final_Verdict}</span></p>
                    </div>
                ) :
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50 shadow-md">
                        <h2 className='my-3 font-bold text-red-600 text-justify'>{response}</h2>
                    </div>
                )}
            </div>

            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} transition={Bounce} />
        </div>
    );
}

export default ATSCheck;
