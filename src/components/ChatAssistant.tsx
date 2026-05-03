import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { getGeminiResponse } from '../geminiService';
import { INITIAL_ASSISTANT_MESSAGE } from '../constants';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: INITIAL_ASSISTANT_MESSAGE }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }));

    const response = await getGeminiResponse(input, history);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 overflow-hidden border border-white">
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Bot size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 uppercase tracking-tight">VoteWise AI</h3>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-600"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Election Cycle 2024</span>
           </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth bg-white"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                m.role === 'user' ? "bg-slate-900 text-white" : "bg-indigo-500 text-white"
              )}>
                {m.role === 'user' ? <User size={20} /> : <span className="font-black text-sm">V</span>}
              </div>
              <div className={cn(
                "p-6 rounded-[32px] text-sm",
                m.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-200" 
                  : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none"
              )}>
                <div className="markdown-body">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 mr-auto"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shrink-0">
              <Loader2 className="animate-spin text-white" size={20} />
            </div>
            <div className="p-6 rounded-[32px] rounded-tl-none bg-slate-50 border border-slate-100 text-slate-400 font-bold italic text-sm">
              Analyzing election data...
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-slate-50">
        <div className="relative flex items-center overflow-hidden">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything... (e.g., 'Where is my polling place?')"
            className="w-full bg-slate-100 border-none rounded-full py-5 px-8 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 ring-blue-50 transition-all outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 w-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:opacity-20 disabled:scale-95 transition-all shadow-lg"
          >
            <Send size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
