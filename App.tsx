
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { LogoIcon } from './components/icons';
import { compareDocuments } from './services/geminiService';

const App: React.FC = () => {
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove "data:application/pdf;base64," prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCompare = useCallback(async () => {
    if (!jdFile || !cvFile) {
      setError('Please upload both a Job Description and a CV.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const [jdBase64, cvBase64] = await Promise.all([
        fileToBase64(jdFile),
        fileToBase64(cvFile),
      ]);
      
      const result = await compareDocuments(jdBase64, cvBase64);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing the documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [jdFile, cvFile]);
  
  const resetState = () => {
    setJdFile(null);
    setCvFile(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <LogoIcon />
          <h1 className="text-3xl sm:text-4xl font-bold text-sky-400">AI-Powered CV Analyzer</h1>
        </div>
        <p className="text-md sm:text-lg text-slate-400">
          Compare a candidate's CV against a job description to get an instant compatibility analysis.
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        {!analysisResult && (
          <>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                id="jd-upload"
                label="Job Description (PDF)"
                onFileSelect={setJdFile}
                file={jdFile}
              />
              <FileUpload
                id="cv-upload"
                label="Candidate's CV (PDF)"
                onFileSelect={setCvFile}
                file={cvFile}
              />
            </div>

            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}

            <button
              onClick={handleCompare}
              disabled={!jdFile || !cvFile || isLoading}
              className="w-full md:w-1/2 px-6 py-3 text-lg font-semibold bg-sky-600 rounded-lg shadow-md hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Compatibility'}
            </button>
          </>
        )}

        {isLoading && <Loader />}

        {analysisResult && (
          <>
            <ResultDisplay content={analysisResult} />
            <button
              onClick={resetState}
              className="w-full md:w-1/2 mt-4 px-6 py-3 text-lg font-semibold bg-slate-600 rounded-lg shadow-md hover:bg-slate-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500"
            >
              Start New Analysis
            </button>
          </>
        )}
      </main>
      
      <footer className="w-full max-w-4xl text-center mt-auto pt-8">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} CV Analyzer. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
