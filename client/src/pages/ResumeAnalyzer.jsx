import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, XCircle, Briefcase, Zap, Plus, Loader2, Target, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                setError('Please upload a PDF file.');
                setFile(null);
                return;
            }
            setError('');
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a resume (PDF) to analyze.');
            return;
        }

        setAnalyzing(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const userInfoStr = localStorage.getItem('userInfo');
            if (!userInfoStr) {
                navigate('/login');
                return;
            }
            const userInfo = JSON.parse(userInfoStr);
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

            const { data } = await axios.post(`${API_BASE}/users/analyze-resume`, formData, {
                headers: { 
                    Authorization: `Bearer ${userInfo.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setAnalysisResult(data.analysis);
            setJobs(data.matchedJobs);
        } catch (err) {
            console.error('Error analyzing resume:', err);
            setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Analyzer</span></h1>
                    <p className="text-gray-400">Upload your PDF resume to receive an ATS score, action-oriented improvements, and customized learning paths & job matching.</p>
                </motion.div>

                {!analysisResult && !analyzing && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass-card p-12 flex flex-col items-center justify-center border-dashed border-2 border-white/20 mt-10"
                    >
                        <div className="bg-blue-500/10 p-6 rounded-full mb-6">
                            <Upload className="w-16 h-16 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">Upload your resume</h2>
                        <p className="text-gray-400 mb-8 text-center max-w-md">Our AI extracts content naturally to provide intelligent scoring completely locally for you.</p>

                        <input 
                            type="file" 
                            accept=".pdf" 
                            id="resume-upload" 
                            className="hidden" 
                            onChange={handleFileChange}
                        />
                        <label 
                            htmlFor="resume-upload"
                            className="cursor-pointer glass px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition flex items-center justify-center gap-3 w-64 mb-4"
                        >
                            <FileText className="w-5 h-5 text-purple-400" />
                            <span>{file ? file.name : "Select PDF File"}</span>
                        </label>
                        
                        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                        
                        <button 
                            onClick={handleUpload}
                            disabled={!file}
                            className="btn-primary py-4 px-10 w-64 text-lg font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Analyze Now
                        </button>
                    </motion.div>
                )}

                {analyzing && (
                    <div className="glass-card p-20 flex flex-col items-center justify-center text-center mt-10">
                        <Loader2 className="w-16 h-16 text-blue-400 animate-spin mb-6" />
                        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Deep Scanning...</h2>
                        <p className="text-gray-400 animate-pulse">Calculating ATS metrics, assessing formatting, and mapping skill deficiencies.</p>
                    </div>
                )}

                {analysisResult && !analyzing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        {/* Start Top Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Score Card */}
                            <div className="glass-card p-8 flex flex-col justify-center items-center text-center col-span-1 border-t-4 border-t-blue-500">
                                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">Overall ATS Score</h3>
                                <div className="relative w-48 h-48 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                        <circle 
                                            cx="96" cy="96" r="88" 
                                            stroke="url(#gradient)" 
                                            strokeWidth="12" fill="transparent" 
                                            strokeDasharray="552.9" 
                                            strokeDashoffset={552.9 - (552.9 * (Number(analysisResult.atsScore) || 0)) / 100} 
                                            className="transition-all duration-1000 ease-out" 
                                            strokeLinecap="round" 
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#a855f7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl font-black text-white">{analysisResult.atsScore}</span>
                                        <span className="text-sm text-gray-400 mt-1">/100</span>
                                    </div>
                                </div>
                                <p className="mt-8 text-sm text-gray-400">Matched to industry technical parser standards</p>
                            </div>

                            {/* Suggestions */}
                            <div className="glass-card p-8 col-span-1 lg:col-span-2">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <Zap className="text-yellow-400" /> Actionable Improvements
                                </h3>
                                <ul className="space-y-4">
                                    {Array.isArray(analysisResult.suggestions) && analysisResult.suggestions.map((sug, i) => (
                                        <li key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="bg-yellow-500/20 p-1.5 rounded-md mt-0.5"><Zap className="w-4 h-4 text-yellow-400" /></div>
                                            <p className="text-gray-300 leading-relaxed text-sm md:text-base">{sug}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Mid Row: Problems & Solutions */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 mt-4">Formatting & Content Deficiencies</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.isArray(analysisResult.problemsAndSolutions) && analysisResult.problemsAndSolutions.map((ps, i) => (
                                    <div key={i} className="glass-card p-6 border-red-500/10 hover:border-red-500/30 transition-colors flex flex-col h-full">
                                        <div className="flex items-start gap-3 mb-4">
                                            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                            <p className="text-red-200 font-medium text-sm">{ps.problem}</p>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-white/10 flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                            <p className="text-green-200 text-sm">{ps.solution}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Row: Jobs and Skills Wrapper */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-white/10">
                            
                            {/* Matching Jobs */}
                            <div>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <Briefcase className="text-blue-400" /> Job Matching Network
                                </h3>
                                {Array.isArray(jobs) && jobs.length > 0 ? (
                                    <div className="space-y-4">
                                        {jobs.map(job => (
                                            <div key={job._id || job.role} className="glass p-5 rounded-xl border border-blue-500/20 hover:bg-white/5 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-2 h-full bg-blue-500 transform translate-x-2 group-hover:translate-x-0 transition-transform"></div>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-lg">{job.role}</h4>
                                                        <p className="text-blue-300 text-sm font-medium">{job.company}</p>
                                                    </div>
                                                    <span className="bg-white/10 px-3 py-1 text-xs rounded-full font-bold">{job.salary}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-4 flex items-center gap-2"><Briefcase className="w-3 h-3" /> {job.type} • {job.location}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="glass p-8 text-center rounded-xl">
                                        <p className="text-gray-400 mb-2">No direct direct database matches found. However, AI suggests applying to:</p>
                                        <div className="flex flex-wrap gap-2 justify-center mt-4">
                                            {Array.isArray(analysisResult.suitableJobs) && analysisResult.suitableJobs.map((job, i) => (
                                                <span key={i} className="bg-white/5 px-4 py-2 rounded-lg text-sm border border-white/10">{job}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Recommended Skills -> Courses */}
                            <div>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <Target className="text-purple-400" /> Upskill & Grow
                                </h3>
                                <p className="text-sm text-gray-400 mb-6">The AI identified these missing skills from your resume based on industry trends. Generate personalized courses instantly to fill these gaps.</p>
                                <div className="space-y-4">
                                    {Array.isArray(analysisResult.recommendedSkills) && analysisResult.recommendedSkills.map((skill, i) => (
                                        <div key={i} className="glass-card p-5 border-purple-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                                                    <BookOpen className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <h4 className="font-bold text-lg text-white">{skill}</h4>
                                            </div>
                                            <button 
                                                onClick={() => navigate('/new-course', { state: { courseName: skill } })}
                                                className="btn-primary !py-2 !px-4 text-sm whitespace-nowrap flex items-center gap-2 w-full sm:w-auto justify-center"
                                            >
                                                Learn this <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reset button */}
                        <div className="pt-8 text-center border-t border-white/5">
                            <button 
                                onClick={() => { setAnalysisResult(null); setFile(null); }}
                                className="text-sm text-gray-400 hover:text-white underline"
                            >
                                Analyze another resume
                            </button>
                        </div>
                    </motion.div>
                )}

            </div>
        </Layout>
    );
};

export default ResumeAnalyzer;
