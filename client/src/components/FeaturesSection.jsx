import React from 'react';
import { motion } from 'framer-motion';
import {
    FileSearch, LayoutTemplate, Zap, Terminal as TerminalIcon,
    Network, TrendingUp, ArrowRight, Star, Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = () => {
    const navigate = useNavigate();

    return (
        <section id="features" className="py-32 px-6 relative bg-[#0B0F1A] overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm mx-auto mb-6">
                        <Star className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">Features</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Powerful features.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            Real learning impact.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        SkillPath AI combines AI intelligence with developer tools to help you learn, practice, and grow faster.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Card 1: Resume Analyzer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        className="col-span-1 bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 hover:bg-blue-500/[0.02] transition-all relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                <FileSearch className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Resume Analyzer</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                Upload your resume and get AI-powered insights to identify skill gaps and level up your profile.
                            </p>
                            <button onClick={() => navigate('/analyzer')} className="text-sm font-semibold text-blue-400 flex items-center gap-2 hover:text-blue-300 transition-colors mt-auto w-max">
                                Analyze Now <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Card 2: Split-Pane Workspace (Highlighted) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="col-span-1 lg:col-span-2 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-blue-500/30 rounded-3xl p-8 hover:border-blue-400/60 shadow-[0_0_40px_rgba(59,130,246,0.1)] transition-all relative overflow-hidden group flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 p-6 flex gap-2">
                            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30 flex items-center gap-1.5">
                                <Star className="w-3 h-3" fill="currentColor" /> FEATURED
                            </div>
                        </div>

                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 border border-blue-500/20">
                            <LayoutTemplate className="w-6 h-6" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                            <div>
                                <h3 className="text-2xl font-bold mb-3 text-white">Split-Pane Workspace</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                    Read theory on the left, write code on the right. Zero context-switching, maximum focus.
                                </p>
                                <button onClick={() => navigate('/register')} className="px-5 py-2.5 rounded-xl border border-blue-500/50 text-blue-400 font-medium hover:bg-blue-500/10 transition-colors flex items-center gap-2">
                                    Open Workspace <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Visual Mockup */}
                            <div className="relative w-full aspect-[4/3] bg-[#050505] rounded-xl border border-white/10 overflow-hidden shadow-2xl flex group-hover:scale-105 transition-transform duration-500">
                                {/* Left Pane */}
                                <div className="w-1/2 border-r border-white/10 p-4 bg-white/[0.02] flex flex-col gap-3">
                                    <div className="w-3/4 h-3 bg-white/20 rounded-full" />
                                    <div className="w-full h-2 bg-white/10 rounded-full mt-2" />
                                    <div className="w-5/6 h-2 bg-white/10 rounded-full" />
                                    <div className="w-full h-2 bg-white/10 rounded-full" />
                                    <div className="w-4/5 h-2 bg-white/10 rounded-full" />
                                </div>
                                {/* Right Pane */}
                                <div className="w-1/2 p-4 bg-[#0B0F1A] flex flex-col gap-3 relative">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <div className="w-2/3 h-2 bg-blue-400/50 rounded-full mt-2" />
                                    <div className="w-1/2 h-2 bg-purple-400/50 rounded-full pl-4" />
                                    <div className="w-3/4 h-2 bg-cyan-400/50 rounded-full" />

                                    {/* Glowing cursor */}
                                    <motion.div
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-2 h-4 bg-blue-400 mt-1"
                                    />

                                    {/* Connection icon overlapping */}
                                    <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-8 h-8 bg-[#0B0F1A] border border-white/20 rounded-full flex items-center justify-center z-10 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                        <span className="text-xs text-blue-400 font-mono">{'</>'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: 1-Click Code Execution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -5 }}
                        className="col-span-1 bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 hover:bg-purple-500/[0.02] transition-all relative group overflow-hidden flex flex-col"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">1-Click Code Execution</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                Run AI-generated code instantly in your terminal. No setup, no hassle.
                            </p>

                            {/* Abstract Graphic */}
                            <div className="w-full h-20 mb-6 relative">
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-16 h-12 bg-black border border-green-500/30 rounded-lg flex items-center p-2 shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all">
                                    <span className="text-green-400 font-mono text-sm">{'>_'}</span>
                                </div>
                                <svg className="absolute left-0 top-1/2 transform -translate-y-1/2 w-24 h-8" viewBox="0 0 100 30" fill="none">
                                    <path d="M0,15 C30,15 40,0 60,15 C80,30 90,15 100,15" stroke="url(#gradient)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                                    <defs>
                                        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop stopColor="#a855f7" />
                                            <stop offset="1" stopColor="#22c55e" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            <button onClick={() => navigate('/register')} className="text-sm font-semibold text-purple-400 flex items-center gap-2 hover:text-purple-300 transition-colors mt-auto w-max">
                                Try It Now <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Card 4: In-Browser Terminal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="col-span-1 bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all relative group flex flex-col"
                    >
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <TerminalIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">In-Browser Terminal</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                            Run Python (via Pyodide) and JS natively in the browser. No installations required.
                        </p>

                        {/* 3D terminal style mockup */}
                        <div className="relative perspective-1000 w-full aspect-video mt-auto">
                            <div className="w-full h-full bg-[#050505] border border-white/20 rounded-xl p-3 shadow-2xl transform rotate-x-12 rotate-y-[-10deg] group-hover:rotate-x-0 group-hover:rotate-y-0 transition-transform duration-500">
                                <div className="flex gap-1.5 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                </div>
                                <div className="font-mono text-[10px] text-emerald-400 flex items-center gap-2">
                                    <span>{'>_'}</span> <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-3 bg-emerald-400 inline-block" />
                                </div>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-emerald-500/30 blur-2xl rounded-full" />
                        </div>
                    </motion.div>

                    {/* Card 5: Dynamic Course Generation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ y: -5 }}
                        className="col-span-1 lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-orange-500/50 hover:bg-orange-500/[0.02] transition-all relative group flex flex-col justify-between overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="flex flex-col md:flex-row gap-8 items-center h-full relative z-10">
                            <div className="flex-1">
                                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 text-orange-400 border border-orange-500/20 group-hover:scale-110 transition-transform">
                                    <Network className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Dynamic Course Generation</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-0">
                                    AI creates personalized, up-to-date courses tailored to your goals and skill level.
                                </p>
                            </div>

                            {/* Data Lines Graphic */}
                            <div className="flex-1 w-full h-32 relative flex items-center">
                                <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none" className="overflow-visible">
                                    <path d="M10,80 Q50,20 100,50 T190,30" fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="2" />
                                    <path d="M10,80 Q50,20 100,50 T190,30" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="200" strokeDashoffset="200" className="group-hover:animate-[dash_2s_ease-out_forwards]" />

                                    {/* Nodes */}
                                    <circle cx="10" cy="80" r="4" fill="#f97316" />
                                    <circle cx="100" cy="50" r="4" fill="#f97316" />
                                    <circle cx="190" cy="30" r="4" fill="#f97316" />
                                </svg>
                                {/* Floating Icons */}
                                <div className="absolute top-[70px] left-[0px] w-6 h-6 bg-[#0B0F1A] border border-orange-500/40 rounded-md flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                                    <FileSearch className="w-3 h-3 text-orange-400" />
                                </div>
                                <div className="absolute top-[40px] left-[90px] w-6 h-6 bg-[#0B0F1A] border border-orange-500/40 rounded-md flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                                    <span className="text-[10px] text-orange-400">{'</>'}</span>
                                </div>
                                <div className="absolute top-[20px] left-[180px] w-6 h-6 bg-[#0B0F1A] border border-orange-500/40 rounded-md flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                                    <Star className="w-3 h-3 text-orange-400" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 6: Progress Tracking */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="col-span-1 bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-cyan-500/50 hover:bg-cyan-500/[0.02] transition-all relative group flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Progress Tracking</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Track your learning streaks, completed modules, and achievements in one place.
                            </p>
                        </div>

                        {/* Circular Progress Mockup */}
                        <div className="flex items-center justify-between mt-auto bg-black/40 rounded-2xl p-4 border border-white/5">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="72, 100" className="group-hover:stroke-blue-400 transition-colors" />
                                </svg>
                                <div className="absolute text-sm font-bold text-white">72%</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Streak</div>
                                <div className="text-lg font-bold text-white flex items-center justify-end gap-1">
                                    <span className="text-orange-500">🔥</span> 12 days
                                </div>
                            </div>
                        </div>
                    </motion.div>



                </div>
            </div>

            {/* Define custom animation in tailwind config or inline style if needed, 
                we're using standard arbitrary values for simplicity */}
            <style jsx>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </section>
    );
};

export default FeaturesSection;
