import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { BrainIcon, PlayIcon, PauseIcon, RefreshIcon, ExternalLinkIcon } from '../icons';
import type { Task, ClassEvent } from '../../types';

// Pomodoro settings
const WORK_MINUTES = 25;
const SHORT_BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;
const POMODOROS_PER_SET = 4;

type SessionType = 'Work' | 'Short Break' | 'Long Break';

interface FocusTimerUIProps {
    isWidget?: boolean;
    focusedEvent?: Task | ClassEvent | null;
    onEndFocus?: () => void;
}

const FocusTimerUI: React.FC<FocusTimerUIProps> = ({ isWidget = false, focusedEvent, onEndFocus }) => {
    const [sessionType, setSessionType] = useState<SessionType>('Work');
    const [pomodoros, setPomodoros] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(WORK_MINUTES * 60);
    const [isActive, setIsActive] = useState(false);
    
    const audioContextRef = useRef<AudioContext | null>(null);

    const playSound = useCallback(() => {
        if (typeof window === 'undefined') return;
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioContextRef.current.currentTime); // C5
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.5);
    }, []);

    useEffect(() => {
        let interval: number | undefined = undefined;

        if (isActive && timeRemaining > 0) {
            interval = window.setInterval(() => {
                setTimeRemaining(time => time - 1);
            }, 1000);
        } else if (timeRemaining === 0 && isActive) {
            playSound();
            setIsActive(false);
            if (sessionType === 'Work') {
                const newPomodoros = pomodoros + 1;
                setPomodoros(newPomodoros);
                if (newPomodoros % POMODOROS_PER_SET === 0) {
                    setSessionType('Long Break');
                    setTimeRemaining(LONG_BREAK_MINUTES * 60);
                } else {
                    setSessionType('Short Break');
                    setTimeRemaining(SHORT_BREAK_MINUTES * 60);
                }
            } else { 
                setSessionType('Work');
                setTimeRemaining(WORK_MINUTES * 60);
            }
        }

        return () => window.clearInterval(interval);
    }, [isActive, timeRemaining, sessionType, pomodoros, playSound]);
    
    useEffect(() => {
        if(typeof window !== 'undefined') {
            document.title = `${Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:${(timeRemaining % 60).toString().padStart(2, '0')} - ${sessionType}`;
        }
    }, [timeRemaining, sessionType]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        switch(sessionType) {
            case 'Work': setTimeRemaining(WORK_MINUTES * 60); break;
            case 'Short Break': setTimeRemaining(SHORT_BREAK_MINUTES * 60); break;
            case 'Long Break': setTimeRemaining(LONG_BREAK_MINUTES * 60); break;
        }
    }, [sessionType]);
    
    const switchSession = (type: SessionType) => {
        if(!isActive || window.confirm('Are you sure you want to switch? Your current progress will be lost.')) {
            setIsActive(false);
            setSessionType(type);
            switch(type) {
                case 'Work': setTimeRemaining(WORK_MINUTES * 60); break;
                case 'Short Break': setTimeRemaining(SHORT_BREAK_MINUTES * 60); break;
                case 'Long Break': setTimeRemaining(LONG_BREAK_MINUTES * 60); break;
            }
        }
    };

    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');

    const SessionButton: React.FC<{type: SessionType}> = ({type}) => (
        <button 
            onClick={() => switchSession(type)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors w-full ${sessionType === type ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}
        >
            {type}
        </button>
    );

    return (
        <div className={`p-4 md:p-8 h-full flex flex-col items-center justify-center text-center transition-all duration-500 ${sessionType === 'Work' ? 'bg-gradient-to-br from-blue-500 to-indigo-700' : 'bg-gradient-to-br from-green-500 to-teal-700'} ${isWidget ? 'rounded-none' : ''}`}>
           <div className="w-full max-w-sm">
                {focusedEvent && !isWidget && (
                    <div className="mb-6 bg-black/20 p-4 rounded-xl text-white text-left shadow-lg">
                        <p className="text-sm opacity-80">Currently focusing on:</p>
                        <p className="font-bold text-lg mt-1">{'title' in focusedEvent ? focusedEvent.title : focusedEvent.subject}</p>
                    </div>
                )}
               
                {!isWidget && !focusedEvent &&(
                    <>
                        <h1 className="text-3xl font-bold text-white mb-2">Focus Timer</h1>
                        <p className="text-white/80 mb-8">Use the Pomodoro Technique to boost your productivity.</p>
                    </>
                )}

                <div className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 text-white`}>
                    <div className="flex justify-center bg-black/10 rounded-lg p-1 space-x-1 mb-8">
                       <SessionButton type="Work" />
                       <SessionButton type="Short Break" />
                       <SessionButton type="Long Break" />
                    </div>

                    <div className="text-7xl md:text-8xl font-bold tabular-nums">
                        {minutes}:{seconds}
                    </div>
                    
                    <div className="flex justify-center items-center space-x-4 mt-8">
                        <button onClick={resetTimer} className="p-3 text-white/70 hover:text-white transition-colors">
                            <RefreshIcon className="w-6 h-6" />
                        </button>
                        <button onClick={toggleTimer} className={`w-20 h-20 rounded-full text-white transition-colors flex items-center justify-center shadow-lg ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-white/20 hover:bg-white/30'}`}>
                            {isActive ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
                        </button>
                         <div className="w-6 h-6 p-3"></div>
                    </div>
                </div>

                <div className="mt-8 text-center text-white">
                    <p className="text-base font-semibold">Pomodoros Completed: {pomodoros}</p>
                    <div className="flex justify-center mt-2 space-x-2">
                        {Array.from({length: POMODOROS_PER_SET}).map((_, i) => (
                           <BrainIcon key={i} className={`w-6 h-6 transition-colors ${i < (pomodoros % POMODOROS_PER_SET) ? 'text-white' : 'text-white/30'}`} />
                        ))}
                    </div>
                </div>
                 {focusedEvent && onEndFocus && !isWidget && (
                    <button onClick={onEndFocus} className="mt-6 text-sm font-semibold text-white/80 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                        Finish Focus Session
                    </button>
                )}
            </div>
        </div>
    );
};

interface FocusProps {
    focusedEvent: Task | ClassEvent | null;
    onEndFocus: () => void;
}

const Focus: React.FC<FocusProps> = ({ focusedEvent, onEndFocus }) => {
    const [widget, setWidget] = useState<{ window: Window, root: HTMLElement } | null>(null);
    const widgetRef = useRef<{ window: Window, root: HTMLElement } | null>(null);

    const openWidget = useCallback(() => {
        if (widgetRef.current) {
            widgetRef.current.window.focus();
            return;
        }

        const newWindow = window.open('', 'FocusTimerWidget', 'width=380,height=550,menubar=no,toolbar=no,location=no,status=no');
        if (newWindow) {
            newWindow.document.title = "Focus Timer";
            const root = newWindow.document.createElement('div');
            root.style.height = '100%';
            newWindow.document.body.appendChild(root);
            newWindow.document.body.style.margin = '0';
            
            const tailwindScript = newWindow.document.createElement('script');
            tailwindScript.src = "https://cdn.tailwindcss.com";
            newWindow.document.head.appendChild(tailwindScript);

            const fontLink = newWindow.document.createElement('link');
            fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
            fontLink.rel = "stylesheet";
            newWindow.document.head.appendChild(fontLink);
            
            newWindow.document.body.style.fontFamily = "Inter, sans-serif";

            const portalState = { window: newWindow, root };
            setWidget(portalState);
            widgetRef.current = portalState;

            newWindow.addEventListener('beforeunload', () => {
                setWidget(null);
                widgetRef.current = null;
            });
        }
    }, []);

    return (
        <div className="h-full relative">
            {widget ? (
                <div className="p-8 h-full flex flex-col items-center justify-center text-center bg-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">Focus Timer is Active</h2>
                    <p className="mt-2 text-gray-600">The timer is running in a separate window.</p>
                    <button onClick={() => widget.window.focus()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
                        Bring to Front
                    </button>
                </div>
            ) : (
                <>
                    <button onClick={openWidget} className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 bg-white/30 text-white rounded-lg text-sm font-semibold hover:bg-white/40 transition-colors">
                        <ExternalLinkIcon className="w-4 h-4" /> Pop-out
                    </button>
                    <FocusTimerUI focusedEvent={focusedEvent} onEndFocus={onEndFocus} />
                </>
            )}
            {widget && ReactDOM.createPortal(<FocusTimerUI isWidget={true} />, widget.root)}
        </div>
    );
};

export default Focus;