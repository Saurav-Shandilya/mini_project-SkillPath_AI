import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Terminal, Code2, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';

const InteractiveTerminal = ({ defaultLanguage = 'javascript', initialCode = '' }) => {
    const [language, setLanguage] = useState(defaultLanguage);
    const [code, setCode] = useState(initialCode || getDefaultCode(defaultLanguage));
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [engineLoaded, setEngineLoaded] = useState(false);
    
    // Store pyodide globally
    useEffect(() => {
        if (language === 'python' && !window.pyodide) {
            loadPyodideEngine();
        } else if (language === 'javascript') {
            setEngineLoaded(true);
        }
    }, [language]);

    const loadPyodideEngine = async () => {
        try {
            setEngineLoaded(false);
            if (!document.getElementById('pyodide-script')) {
                const script = document.createElement('script');
                script.id = 'pyodide-script';
                script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
                document.body.appendChild(script);
                await new Promise((resolve) => { script.onload = resolve; });
            }
            
            if (!window.pyodide) {
                window.pyodideLogs = [];
                window.pyodide = await window.loadPyodide({
                    stdout: (msg) => { window.pyodideLogs.push(msg); },
                    stderr: (msg) => { window.pyodideLogs.push(msg); }
                });
            }
            setEngineLoaded(true);
        } catch (err) {
            console.error('Failed to load Pyodide', err);
            setOutput('Failed to load Python Engine. If you are using an adblocker or restricted network, please switch to the JS environment.');
        }
    };

    function getDefaultCode(lang) {
        if (lang === 'python') return "# Write your Python code here\nprint(\"Hello from Machine Learning Lab!\")\n";
        return "// Write your JavaScript code here\nconsole.log(\"Hello from JavaScript Sandbox!\");\n";
    }

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        setCode(getDefaultCode(newLang));
        setOutput('');
        if (newLang === 'python' && !window.pyodide) {
            loadPyodideEngine();
        } else {
            setEngineLoaded(true);
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput('Executing...\n');

        try {
            if (language === 'javascript') {
                runJavascript();
            } else if (language === 'python') {
                await runPython();
            }
        } catch (error) {
            setOutput((prev) => prev + `\nError: ${error.message || error}`);
        } finally {
            setIsRunning(false);
        }
    };

    const runJavascript = () => {
        let logs = [];
        const originalLog = console.log;
        const originalError = console.error;
        
        console.log = (...args) => {
            logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
        };
        console.error = (...args) => {
            logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
        };

        try {
            // Using new Function creates a localized execution block
            const executor = new Function(code);
            executor();
            setOutput(logs.join('\n') || 'Execution complete (no output).');
        } catch (err) {
            setOutput(logs.join('\n') + `\nRuntime Error: ${err.message}`);
        } finally {
            // Restore console immediately
            console.log = originalLog;
            console.error = originalError;
        }
    };

    const runPython = async () => {
        if (!window.pyodide) {
            setOutput('Python Environment is still installing...\nPlease try again in a few seconds.');
            return;
        }
        
        window.pyodideLogs = []; // Reset logs
        try {
            // Check if there is an explicit return
            const result = await window.pyodide.runPythonAsync(code);
            
            let finalOutput = window.pyodideLogs.join('\n');
            if (result !== undefined) {
                finalOutput += finalOutput ? `\n\nOut: ${result}` : `Out: ${result}`;
            }
            setOutput(finalOutput || 'Execution complete (no output).');
        } catch (err) {
            setOutput((prev) => window.pyodideLogs.join('\n') + `\n\nPython Traceback:\n${err.message}`);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#0a0f1d] overflow-hidden">
            {/* Header Toolbar */}
            <div className="flex justify-between items-center sm:items-center bg-[#111a2f] p-3 sm:p-4 border-b border-white/5 gap-3 shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                        <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white tracking-wide text-sm sm:text-base">Practice Lab</h3>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center bg-black/30 p-1 rounded-lg border border-white/5">
                        <button 
                            onClick={() => handleLanguageChange('javascript')}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${language === 'javascript' ? 'bg-blue-500/20 text-blue-300' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            JS
                        </button>
                        <button 
                            onClick={() => handleLanguageChange('python')}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${language === 'python' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Python
                        </button>
                    </div>
                    
                    <div className="flex gap-2">
                        <button onClick={() => setCode(getDefaultCode(language))} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Reset Code">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>

                    <button 
                        onClick={runCode}
                        disabled={!engineLoaded || isRunning}
                        className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold transition-colors shadow-lg shadow-blue-500/20 text-sm"
                    >
                        {isRunning ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-white" />}
                        <span>Run Code</span>
                    </button>
                </div>
            </div>

            {/* Split Screen Workspace - Stacked Vertically */}
            <div className="flex flex-col flex-1 overflow-hidden">
                
                {/* Code Editor */}
                <div className="w-full flex-1 border-b border-white/5 flex flex-col relative min-h-[300px]">
                    {language === 'python' && !engineLoaded && (
                        <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
                            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin mb-4" />
                            <p className="text-yellow-400 font-mono text-sm animate-pulse">Initializing Pyodide WASM Engine...</p>
                        </div>
                    )}
                    
                    {/* Line numbers logic is highly manual, so we use a simple clean interface for reliability */}
                    <textarea 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 w-full bg-black/20 text-gray-200 font-mono text-sm p-4 focus:outline-none resize-none leading-relaxed"
                        spellCheck="false"
                        autoCapitalize="false"
                        autoComplete="off"
                    />
                </div>

                {/* Console Output */}
                <div className="w-full h-1/3 min-h-[200px] bg-black/40 flex flex-col shrink-0">
                    <div className="bg-[#050810]/50 py-1.5 px-3 sm:py-2 sm:px-4 shadow flex items-center gap-2 border-b border-white/5 shrink-0">
                        <Terminal className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Output Console</span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {output ? (
                            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{output}</pre>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-30">
                                <Terminal className="w-12 h-12 mb-4" />
                                <p className="font-mono text-sm">Waiting for execution...</p>
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default InteractiveTerminal;
