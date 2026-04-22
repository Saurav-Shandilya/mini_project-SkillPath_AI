import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle, ListChecks, PanelRightClose, PanelRightOpen, Code2, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import InteractiveTerminal from '../components/InteractiveTerminal';
import API_BASE from '../config';

const CodeBlockRenderer = ({ inline, className, children, ...props }) => {
    const [copied, setCopied] = useState(false);
    
    if (inline) {
        return <code className="bg-blue-500/10 px-1.5 py-0.5 rounded text-sm font-mono border border-blue-500/20" {...props}>{children}</code>;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-6 rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-black/50 bg-[#050810]">
            <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-gray-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                >
                    {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-xs font-semibold">{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
            </div>
            
            {className && (
                <div className="absolute left-4 top-3 text-[10px] text-gray-500 font-mono uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded border border-white/5">
                    {className.replace('language-', '')}
                </div>
            )}
            
            <div className="p-5 pt-12 overflow-x-auto w-full custom-scrollbar">
                <code className={`text-sm font-mono text-gray-300 leading-relaxed block ${className || ''}`} {...props}>
                    {children}
                </code>
            </div>
        </div>
    );
};

const ModuleView = () => {
    const { courseId, moduleIndex } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [moduleData, setModuleData] = useState(null);
    const [courseName, setCourseName] = useState('');
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

    useEffect(() => {
        const fetchModuleContent = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                // Get course metadata
                const courseRes = await axios.get(`${API_BASE}/courses/${courseId}`, config);
                const course = courseRes.data;
                setCourseName(course.courseName);
                const currentModule = course.structure[moduleIndex];

                // Generate or retrieve JSON content with tasks
                const contentRes = await axios.post(`${API_BASE}/courses/${courseId}/module/${moduleIndex}/generate`, {}, config);

                setModuleData({
                    topic: currentModule.topic,
                    chapter: currentModule.chapter || currentModule.dayRange,
                    markdown: contentRes.data.markdown,
                    youtubeId: contentRes.data.youtubeId,
                    tasks: contentRes.data.tasks || [],
                    status: currentModule.status
                });

            } catch (error) {
                console.error('Failed to fetch module content:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchModuleContent();
    }, [courseId, moduleIndex]);

    const handleMarkComplete = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.put(`${API_BASE}/courses/update-module`, {
                courseId,
                moduleIndex: parseInt(moduleIndex),
                status: 'completed'
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            navigate(`/course/${courseId}`);
        } catch (error) {
            console.error('Failed to mark complete:', error);
        }
    };

    const handleToggleTask = async (taskId, currentStatus) => {
        const originalTasks = [...moduleData.tasks];
        setModuleData(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t._id === taskId ? { ...t, completed: !currentStatus } : t)
        }));

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.put(`${API_BASE}/courses/update-task`, {
                courseId,
                moduleIndex: parseInt(moduleIndex),
                taskId,
                completed: !currentStatus
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
        } catch (error) {
            console.error('Failed to update task:', error);
            setModuleData(prev => ({ ...prev, tasks: originalTasks }));
        }
    };

    if (loading) return (
        <div className="bg-[#050810] text-white min-h-screen flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
            <h2 className="text-3xl font-bold mb-3 tracking-wide">Compiling Virtual Lab</h2>
            <p className="text-gray-400 max-w-md text-center text-lg">
                SkillPath AI is synthesizing theory and generating practical code tasks for this lesson...
            </p>
        </div>
    );

    if (!moduleData) return (
        <div className="bg-[#050810] min-h-screen flex items-center justify-center">
            <p className="text-gray-400">Failed to load module content. Please try again.</p>
        </div>
    );

    const completedTasksCount = moduleData.tasks.filter(t => t.completed).length;
    const totalTasks = moduleData.tasks.length;

    // We no longer use <Layout>. This component manages a 100vw, 100vh layout directly.
    return (
        <div className="flex flex-col h-screen w-screen bg-[#050810] text-gray-200 font-sans overflow-hidden">
            
            {/* --- TOP APP HEADER --- */}
            <header className="h-[60px] shrink-0 bg-[#0a0f1d] border-b border-white/5 px-4 md:px-6 flex items-center justify-between z-50">
                <div className="flex items-center gap-4 md:gap-6">
                    <button
                        onClick={() => navigate(`/course/${courseId}`)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                        <span className="hidden sm:inline">Back</span>
                    </button>
                    
                    <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold tracking-widest uppercase text-xs md:text-sm">
                            {courseName}
                        </span>
                        <span className="text-gray-500 hidden md:inline">•</span>
                        <span className="text-gray-400 font-medium text-xs md:text-sm hidden md:inline">
                            {moduleData.chapter.replace('Day', 'Chapter')}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!isWorkspaceOpen && (
                        <button 
                            onClick={() => setIsWorkspaceOpen(true)}
                            className="flex items-center gap-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-4 py-1.5 rounded border border-blue-500/20 transition-colors font-semibold text-sm"
                        >
                            <Code2 className="w-4 h-4" /> 
                            <span className="hidden sm:inline">Open Practice Lab</span>
                        </button>
                    )}
                </div>
            </header>

            {/* --- MAIN CONTENT SPLIT --- */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                
                {/* LEFT PANEL: LESSON CONTENT */}
                <div className={`flex-1 overflow-y-auto w-full transition-all duration-500 custom-scrollbar ${isWorkspaceOpen ? 'lg:max-w-[50%] border-r border-white/5' : 'max-w-4xl mx-auto'}`}>
                    <div className="p-6 md:p-10 pb-32">
                        
                        <div className="mb-10">
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white mb-4">{moduleData.topic}</h1>
                        </div>

                        {/* Smart YouTube Search Embed */}
                        {moduleData.youtubeId && (
                            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black mb-10 border border-white/10 relative bg-black">
                                <iframe 
                                    className="w-full h-full absolute top-0 left-0"
                                    src={`https://www.youtube.com/embed/${moduleData.youtubeId}`} 
                                    allowFullScreen 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    title={`YouTube Tutorial for ${moduleData.topic}`}
                                ></iframe>
                            </div>
                        )}

                        {/* Markdown Content Box */}
                        <div className="prose prose-invert prose-blue max-w-none prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-code:text-blue-300">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-6 pb-2 border-b border-white/10" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-blue-400 mt-8 mb-4" {...props} />,
                                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-purple-400 mt-6 mb-3" {...props} />,
                                    pre: ({node, children, ...props}) => <div className="not-prose" {...props}>{children}</div>,
                                    code: CodeBlockRenderer,
                                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 bg-blue-500/5 p-4 rounded-r-xl italic text-gray-400 my-6" {...props} />,
                                    table: ({node, ...props}) => <div className="overflow-x-auto my-8"><table className="w-full text-left border-collapse" {...props} /></div>,
                                    th: ({node, ...props}) => <th className="bg-white/5 p-4 font-bold border-b border-white/10" {...props} />,
                                    td: ({node, ...props}) => <td className="p-4 border-b border-white/5 text-gray-400" {...props} />
                                }}
                            >
                                {moduleData.markdown}
                            </ReactMarkdown>
                        </div>

                        {/* Footer Action */}
                        <div className="mt-16 pt-8 border-t border-white/5 flex justify-start">
                            <button
                                onClick={handleMarkComplete}
                                className="btn-primary py-3 px-8 text-base flex items-center gap-2 shadow-lg shadow-blue-500/25"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Lesson Completed
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: INTERACTIVE WORKSPACE */}
                <AnimatePresence>
                    {isWorkspaceOpen && (
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="w-full lg:w-[50%] h-full shrink-0 bg-[#0a0f1d] flex flex-col z-40 overflow-hidden"
                        >
                            
                            {/* Panel Header */}
                            <div className="h-12 bg-black/20 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <ListChecks className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Interactive Practice</span>
                                </div>
                                <button 
                                    onClick={() => setIsWorkspaceOpen(false)}
                                    className="p-1.5 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors"
                                    title="Minimize Sidebar"
                                >
                                    <PanelRightClose className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Scrollable Tasks & IDE wrapper */}
                            <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
                                
                                {/* Checklist Module */}
                                {totalTasks > 0 && (
                                    <div className="p-6 shrink-0 border-b border-white/5 bg-black/10">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-white mb-1">Your Tasks</h3>
                                                <p className="text-xs text-gray-500">Complete these to master the lesson concepts.</p>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${completedTasksCount === totalTasks ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                                                {completedTasksCount} / {totalTasks} Completed
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {moduleData.tasks.map((task) => (
                                                <label 
                                                    key={task._id} 
                                                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                                        task.completed 
                                                        ? 'bg-green-500/5 border-green-500/20 text-green-100/60' 
                                                        : 'bg-black/20 border-white/5 text-gray-300 hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className="relative flex items-start mt-0.5 shrink-0">
                                                        <input 
                                                            type="checkbox" 
                                                            className="peer sr-only"
                                                            checked={task.completed}
                                                            onChange={() => handleToggleTask(task._id, task.completed)}
                                                        />
                                                        <div className="w-4 h-4 border-2 border-gray-600 rounded flex items-center justify-center peer-checked:bg-green-500 peer-checked:border-green-500 transition-colors">
                                                            <CheckCircle className={`w-3 h-3 text-white transition-opacity ${task.completed ? 'opacity-100' : 'opacity-0'}`} />
                                                        </div>
                                                    </div>
                                                    <span className={`text-sm leading-snug ${task.completed ? 'line-through' : ''}`}>
                                                        {task.description}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Code Terminal perfectly fits remaining height */}
                                <div className="flex-1 min-h-[500px] p-6 lg:p-4">
                                    <InteractiveTerminal defaultLanguage={courseName.toLowerCase().includes('machine learning') || courseName.toLowerCase().includes('python') ? 'python' : 'javascript'} />
                                </div>
                            </div>
                            
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
        </div>
    );
};

export default ModuleView;
