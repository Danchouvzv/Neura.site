
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Task, TeamRole } from '../types';
import { Download, FileText, Sparkles } from 'lucide-react';

interface AnalyticsProps {
  tasks: Task[];
  t: any;
}

const Analytics: React.FC<AnalyticsProps> = ({ tasks, t }) => {
  // Fixed error: Property 'split' does not exist on type 'unknown' by adding a type cast to string
  const roleData = Object.values(TeamRole).map(role => ({
    name: (role as string).split(' ')[0],
    completed: tasks.filter(t => t.role === role && t.status === 'Done').length,
  }));

  const COLORS = ['#ec4899', '#db2777', '#be185d', '#9d174d', '#831843'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white pink-text-glow">{t.analytics}</h2>
          <p className="text-slate-500">Data-driven engineering insights.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-pink-600/30">
            <FileText size={18} />
            {t.inspireReport}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0a0a0a] border border-pink-500/10 p-8 rounded-2xl shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-8">Role Velocity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleData}>
                <XAxis dataKey="name" stroke="#ec4899" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(236, 72, 153, 0.1)'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #ec4899' }} />
                <Bar dataKey="completed" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-900/20 to-black border border-pink-500/30 p-8 rounded-2xl flex flex-col justify-center items-center text-center">
          <Sparkles className="text-pink-500 mb-4" size={48} />
          <h3 className="text-2xl font-bold text-white mb-4">Engineering Portfolio</h3>
          <p className="text-slate-400 mb-6">Our algorithms have analyzed 124 commits and 42 design iterations. Ready to generate?</p>
          <button className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase tracking-tighter hover:bg-pink-500 hover:text-white transition-all shadow-2xl">
            {t.createPortfolio}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
