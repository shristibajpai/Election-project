import { motion } from 'motion/react';
import { ArrowRight, CircleCheck, Info, MapPin, Calendar, Users } from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
}

export default function LandingView({ onStart }: LandingViewProps) {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-20 px-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-400/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-400/10 blur-[100px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 z-10"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-blue-100 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Smart Election Companion
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] max-w-4xl mx-auto text-slate-900">
          Democracy, <br />
          <span className="text-blue-600">Reimagined.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          The ultimate Civic Power Assistant. Track deadlines, research candidates, and cast your vote with absolute confidence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <button
            onClick={onStart}
            className="group relative px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-wider shadow-xl shadow-blue-200 hover:scale-105 transition-all flex items-center gap-3 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
               Start Your Journey
               <ArrowRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </span>
          </button>
          
          <button 
            className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-[24px] font-black uppercase tracking-wider hover:border-blue-400 hover:text-blue-600 transition-all shadow-lg shadow-slate-200/50"
          >
            Explore Tools
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl"
      >
        {[
          { label: 'Register', icon: CircleCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Choices', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Guide', icon: Info, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Live Data', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' }
        ].map((item, i) => (
          <div key={i} className="p-8 bg-white rounded-[32px] border border-white shadow-xl shadow-blue-900/5 flex flex-col items-center gap-4 group hover:scale-105 transition-transform cursor-default">
             <div className={`p-4 rounded-2xl ${item.bg} ${item.color}`}>
                <item.icon size={28} strokeWidth={2.5} />
             </div>
             <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
