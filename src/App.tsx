/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Map as MapIcon, 
  Home, 
  Bell, 
  Search,
  Menu,
  X,
  MapPin
} from 'lucide-react';
import LandingView from './components/LandingView';
import JourneyView from './components/JourneyView';
import ChatAssistant from './components/ChatAssistant';
import PollingStationFinder from './components/PollingStationFinder';
import { ViewState } from './types';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-xl shadow-blue-900/5 px-6 py-4 border-b border-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView('landing')}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              <div className="text-white font-black text-lg">V</div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-blue-900 leading-none">VOTEWISE</h1>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none mt-1">Civic Power Assistant</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setView('landing')}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-colors ${view === 'landing' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setView('journey')}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-colors ${view === 'journey' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Journey
            </button>
            <button 
              onClick={() => setView('polling-stations')}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-colors ${view === 'polling-stations' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Locator
            </button>
            <button 
              onClick={() => setView('assistant')}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-colors ${view === 'assistant' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              AI Assistant
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-tight">System Active</span>
            </div>
            <button className="md:hidden p-2 text-slate-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {[
                { id: 'landing', label: 'Home', icon: Home },
                { id: 'journey', label: 'Journey', icon: MapIcon },
                { id: 'polling-stations', label: 'Locator', icon: MapPin },
                { id: 'assistant', label: 'AI Assistant', icon: MessageSquare }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id as ViewState);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 text-2xl font-display font-bold ${view === item.id ? 'text-blue-600' : 'text-neutral-900'}`}
                >
                  <item.icon size={28} /> {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <LandingView onStart={() => setView('journey')} />
            </motion.div>
          )}

          {view === 'journey' && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <JourneyView />
            </motion.div>
          )}

          {view === 'polling-stations' && (
            <motion.div
              key="polling-stations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <PollingStationFinder />
            </motion.div>
          )}

          {view === 'assistant' && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="h-[calc(100vh-80px)] p-6"
            >
              <ChatAssistant />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6 shadow-2xl shadow-blue-900/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              V
            </div>
            <span className="font-black text-slate-900 text-lg tracking-tight uppercase">VoteWise</span>
          </div>
          
          <div className="flex items-center gap-8 text-xs font-black uppercase tracking-wider text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Resources</a>
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
            &copy; 2024 VOTEWISE. Non-partisan election education.
          </p>
        </div>
      </footer>
    </div>
  );
}
