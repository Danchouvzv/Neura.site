import React from 'react';

const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Network Forums', value: '3', id: 'NOD-01' },
    { label: 'Active Events', value: '10+', id: 'NOD-02' },
    { label: 'Core Projects', value: '5', id: 'NOD-03' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-16">
      {stats.map((stat, i) => (
        <div key={i} className="relative group p-12 rounded-[50px] bg-black border border-[#ff007f11] text-center overflow-hidden transition-all hover:bg-[#ff007f05] hover:border-[#ff007f]/40 hover:shadow-[0_0_50px_rgba(255,0,127,0.1)]">
          <div className="absolute top-8 left-12 text-[8px] font-black text-[#ff007f] tracking-[0.5em] opacity-40 uppercase group-hover:opacity-100 transition-opacity">
            {stat.id}
          </div>
          <div className="font-tech text-7xl md:text-8xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-[#ff007f] drop-shadow-[0_0_15px_rgba(255,0,127,0.2)]">{stat.value}</div>
          <div className="text-white/30 text-[10px] font-black tracking-[0.6em] uppercase group-hover:text-white/60 transition-colors">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
