import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ELECTION_STEPS } from '../constants';
import * as Icons from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import JourneyTimeline from './JourneyTimeline';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PriorityFilter = 'All' | 'High' | 'Medium' | 'Low';
type SortOrder = 'Chronological' | 'Priority';

const priorityWeight = {
  'High': 3,
  'Medium': 2,
  'Low': 1
};

export default function JourneyView() {
  const [filter, setFilter] = useState<PriorityFilter>('All');
  const [sortBy, setSortBy] = useState<SortOrder>('Chronological');

  const filteredSteps = useMemo(() => {
    let steps = [...ELECTION_STEPS];
    
    if (filter !== 'All') {
      steps = steps.filter(step => step.priority === filter);
    }
    
    if (sortBy === 'Priority') {
      steps.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
    } else {
      steps.sort((a, b) => a.startDay - b.startDay);
    }
    
    return steps;
  }, [filter, sortBy]);

  return (
    <div className="space-y-16 max-w-5xl mx-auto py-20 px-6">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4"
        >
          Follow the light
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tight text-slate-900"
        >
          Your Voting Journey
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 text-lg font-medium max-w-2xl mx-auto"
        >
          A clear, step-by-step path to civic engagement. 
          Each phase is designed to empower your final decision.
        </motion.p>
      </div>

      {/* Timeline Visualization */}
      <JourneyTimeline />

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-white shadow-2xl shadow-blue-900/5">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter:</span>
          {(['All', 'High', 'Medium', 'Low'] as PriorityFilter[]).map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                filter === p 
                  ? "bg-slate-900 text-white" 
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sort by:</span>
          {(['Chronological', 'Priority'] as SortOrder[]).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                sortBy === s 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Progress Line - Only show if not sorted by priority and not filtered */}
        {sortBy === 'Chronological' && filter === 'All' && (
          <div className="absolute left-[39px] md:left-1/2 top-10 bottom-10 w-1.5 bg-slate-100 -translate-x-1/2 hidden md:block" />
        )}

        <div className="space-y-32">
          <AnimatePresence mode="popLayout">
            {filteredSteps.map((step, index) => {
              const Icon = (Icons as any)[step.icon];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className={cn(
                    "relative flex flex-col md:flex-row items-center gap-12 md:gap-0",
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  {/* Visual Anchor */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-24 h-24 rounded-[32px] bg-white border border-white flex items-center justify-center shadow-2xl shadow-blue-900/5 z-10 p-2">
                    <div className={cn("w-full h-full rounded-[24px] flex items-center justify-center text-white shadow-inner", step.color)}>
                      <Icon size={32} strokeWidth={2.5} />
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-white border-4 border-sky-50 flex items-center justify-center text-slate-900 font-black text-[10px] shadow-md uppercase tracking-tight text-center leading-none">
                        {step.priority}<br/>Priority
                    </div>
                  </div>

                  <div className="w-full md:w-[42%] pl-24 md:pl-0">
                    <div className={cn(
                      "p-10 bg-white rounded-[40px] border border-white shadow-2xl shadow-blue-900/5 hover:scale-[1.02] transition-transform",
                      isEven ? "md:text-right" : "md:text-left"
                    )}>
                      <div className="space-y-6">
                        <div>
                          <div className={cn(
                            "flex items-center gap-2 mb-2",
                            isEven ? "md:justify-end" : "md:justify-start"
                          )}>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                              Phase {index + 1}
                            </span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                              step.priority === 'High' ? "bg-rose-50 text-rose-600" :
                              step.priority === 'Medium' ? "bg-amber-50 text-amber-600" :
                              "bg-slate-50 text-slate-500"
                            )}>
                              {step.priority}
                            </span>
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{step.title}</h3>
                        </div>
                        <p className="text-slate-500 font-medium leading-relaxed">{step.description}</p>
                        
                        <div className={cn(
                          "flex flex-col gap-3 pt-4 border-t border-slate-50",
                          isEven ? "md:items-end" : "md:items-start"
                        )}>
                          {step.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                               {!isEven && <Icons.CheckCircle2 size={16} className="text-blue-600 shrink-0" />}
                               <span className="text-xs font-bold text-slate-700">{detail}</span>
                               {isEven && <Icons.CheckCircle2 size={16} className="text-blue-600 shrink-0" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:block w-[16%]" />
                  <div className="hidden md:block w-[42%]" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
