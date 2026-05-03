import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, XAxisProps, YAxisProps } from 'recharts';
import { ELECTION_STEPS } from '../constants';
import { motion } from 'motion/react';

const data = ELECTION_STEPS.map(step => ({
  name: step.title,
  start: step.startDay,
  duration: step.endDay - step.startDay,
  color: step.color.replace('bg-', ''), // We need hex or color names for recharts, but we can map them
}));

// Map tailwind color classes to hex
const colorMap: Record<string, string> = {
  'blue-500': '#3b82f6',
  'purple-500': '#a855f7',
  'emerald-500': '#10b981',
  'orange-500': '#f97316'
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const step = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">{step.name}</p>
        <p className="text-sm font-bold text-slate-700">Days {step.start} to {step.start + step.duration}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Duration: {step.duration} Days</p>
      </div>
    );
  }
  return null;
};

export default function JourneyTimeline() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white p-8"
    >
      <div className="mb-8">
         <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Process Sequence</h3>
         <p className="text-xs font-bold text-slate-500 italic">Visualizing the parallel and sequential phases of the election.</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              hide 
              domain={[0, 115]}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={120}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            {/* Hidden bar for offset */}
            <Bar dataKey="start" stackId="a" fill="transparent" />
            {/* Visible bar for duration */}
            <Bar dataKey="duration" stackId="a" radius={[0, 20, 20, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorMap[entry.color] || '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-300 border-t border-slate-50 pt-6">
        <span>Start (Day 0)</span>
        <div className="flex gap-8">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Registration</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span>Voting Day</span>
           </div>
        </div>
        <span>End (Day 110)</span>
      </div>
    </motion.div>
  );
}
