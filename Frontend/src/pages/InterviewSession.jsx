import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitAnswer, getResults } from '../store/slices/interviewSlice';
import { 
  FiCpu, 
  FiUser, 
  FiSend, 
  FiX, 
  FiCheckCircle, 
  FiAlertCircle,
  FiCode,
  FiMic,
  FiMicOff
} from 'react-icons/fi';

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.interview);

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [conversation, setConversation] = useState([]);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const textareaRef = useRef(null);
  const conversationEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const interviewData = location.state;

  useEffect(() => {
    if (!interviewData) {
      navigate('/interview');
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      setConversation([{
        type: 'question',
        content: interviewData.currentQuestion,
        questionNumber: interviewData.questionNumber
      }]);
      setIsTyping(false);
    }, 1000);

    textareaRef.current?.focus();
  }, [interviewData, navigate]);

  useEffect(() => {
    // Smooth scroll instead of jump
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [conversation, isTyping]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setCurrentAnswer((prev) => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error("Error starting speech recognition", e);
        }
      } else {
        alert("Your browser does not support Speech Recognition. Please use Google Chrome or Edge.");
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    try {
      const result = await dispatch(submitAnswer({
        interviewId: interviewData.interviewId,
        answer: currentAnswer.trim()
      })).unwrap();

      setConversation(prev => [...prev, {
        type: 'answer',
        content: currentAnswer.trim(),
        questionNumber: interviewData.questionNumber
      }]);

      setCurrentAnswer('');

      if (result.completed) {
        setInterviewCompleted(true);

        setTimeout(() => {
          dispatch(getResults(interviewData.interviewId)).then((result) => {
            if (result.payload.success) {
              navigate('/interview-results', {
                state: { results: result.payload.data }
              });
            }
          });
        }, 2000);
      } else {
        setIsTyping(true);

        setTimeout(() => {
          setConversation(prev => [...prev, {
            type: 'question',
            content: result.data.nextQuestion,
            questionNumber: result.data.questionNumber
          }]);
          setIsTyping(false);
          interviewData.questionNumber = result.data.questionNumber;
        }, 1500);
      }

    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmitAnswer();
    }
  };

  const exitInterview = () => {
    if (window.confirm('Are you sure you want to end this session early? Your progress will be lost.')) {
      navigate('/interview');
    }
  };

  if (!interviewData) return null;

  const progressPercentage = ((interviewData.questionNumber - 1) / interviewData.totalQuestions) * 100;

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
              <FiCpu className="text-white" size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">Ascend AI Interviewer</h1>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><FiCode size={12}/> {interviewData.technology}</span>
                <span>•</span>
                <span className="capitalize">{interviewData.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Question {interviewData.questionNumber} of {interviewData.totalQuestions}
            </span>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <button
            onClick={exitInterview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <FiX size={14} />
            End Session
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto scroll-smooth pb-6 pt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Intro Message */}
          <div className="text-center pb-8 border-b border-slate-200/60 mb-8">
            <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiCpu className="text-teal-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Technical Interview Started</h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              I'll be asking you {interviewData.totalQuestions} questions regarding {interviewData.technology}. 
              Take your time and provide detailed answers.
            </p>
          </div>

          {/* Conversation History */}
          <div className="space-y-10">
            {conversation.map((msg, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 mt-1">
                  {msg.type === 'question' ? (
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                      <FiCpu className="text-teal-600" size={14} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <FiUser className="text-slate-500" size={14} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 pt-1">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {msg.type === 'question' ? 'Interviewer' : 'You'}
                  </h3>
                  <div className={`text-[15px] leading-relaxed ${
                    msg.type === 'question' 
                      ? 'text-slate-900 font-medium' 
                      : 'text-slate-700'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                    <FiCpu className="text-teal-600" size={14} />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Interviewer
                  </h3>
                  <div className="flex gap-1.5 items-center h-6">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Completion Message */}
          {interviewCompleted && (
            <div className="flex justify-center pt-8">
              <div className="bg-emerald-50 border border-emerald-200 px-6 py-4 rounded-xl text-emerald-800 flex items-center gap-3 shadow-sm">
                <FiCheckCircle className="text-emerald-600 shrink-0" size={20} />
                <span className="font-medium text-sm">Interview Completed! Analyzing your responses...</span>
              </div>
            </div>
          )}
          <div ref={conversationEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      {!interviewCompleted && (
        <div className="shrink-0 bg-white border-t border-slate-200 px-4 py-4 sm:py-6">
          <div className="max-w-3xl mx-auto">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-2 rounded-lg mb-3 flex items-center gap-2 shadow-sm">
                <FiAlertCircle size={14} /> {error}
              </div>
            )}

            <div className="relative bg-slate-50 border border-slate-200 rounded-2xl focus-within:bg-white focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all overflow-hidden shadow-sm">
              <textarea
                ref={textareaRef}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your answer here... (Cmd/Ctrl + Enter to submit)"
                className="w-full max-h-[200px] min-h-[60px] bg-transparent border-0 px-5 py-4 pr-14 text-[15px] text-slate-800 resize-none outline-none focus:ring-0 leading-relaxed custom-scrollbar"
                rows={2}
                disabled={loading}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  disabled={loading}
                  title="Toggle voice input"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-red-500 text-white shadow-[0_0_0_4px_rgba(239,68,68,0.2)] animate-pulse'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isListening ? <FiMicOff size={14} /> : <FiMic size={14} />}
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={loading || !currentAnswer.trim()}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    currentAnswer.trim() && !loading
                      ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <FiSend size={14} className={currentAnswer.trim() && !loading ? '-ml-0.5' : ''} />
                </button>
              </div>
            </div>
            <div className="text-center mt-3">
              <span className="text-[11px] text-slate-400 font-medium">Ascend AI can make mistakes. Focus on clear, structured answers.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
