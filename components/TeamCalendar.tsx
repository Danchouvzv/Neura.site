
import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Trash2, 
  Edit2, 
  Target, 
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import { CalendarEvent, TeamRole } from '../types';

interface CalProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  user: any;
  t: any;
  lang: string;
}

const TeamCalendar: React.FC<CalProps> = ({ events, setEvents, user, t, lang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const isCaptain = user?.role === "Captain";

  // Form State for Missions
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formPriority, setFormPriority] = useState('High');

  // Advanced Calendar Calculation Logic
  const { calendarGrid } = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    // Calculate Mon=0 to Sun=6
    let startDay = firstDayOfMonth.getDay() - 1;
    if (startDay === -1) startDay = 6; 

    const grid = [];
    // Prev Month Padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      grid.push({ day: prevMonthLastDay - i, currentMonth: false, monthOffset: -1 });
    }
    // Current Month
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({ day: i, currentMonth: true, monthOffset: 0 });
    }
    // Next Month Padding
    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      grid.push({ day: i, currentMonth: false, monthOffset: 1 });
    }
    return { calendarGrid: grid };
  }, [viewDate]);

  const openAddModal = (dateStr?: string) => {
    if (!isCaptain) return;
    setEditingEvent(null);
    setFormTitle('');
    setFormDate(dateStr || new Date().toISOString().split('T')[0]);
    setFormLocation('');
    setFormPriority('High');
    setIsModalOpen(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    if (!isCaptain) return;
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormDate(event.date);
    setFormLocation(event.location);
    setFormPriority(event.priority);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formTitle || !formDate) return;

    // Fixing error in file components/TeamCalendar.tsx on line 110: Object literal may only specify known properties, and 'type' does not exist in type 'CalendarEvent'.
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? {
        ...e, 
        title: formTitle, 
        date: formDate, 
        location: formLocation, 
        priority: formPriority
      } : e));
    } else {
      const newEvent: CalendarEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: formTitle, 
        date: formDate, 
        location: formLocation, 
        priority: formPriority
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(lang === 'ru' ? 'Удалить это событие?' : 'Delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const goToToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#050505] p-8 rounded-[3rem] border border-pink-500/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-pink-600/10 rounded-2xl flex items-center justify-center text-pink-500 border border-pink-500/20 shadow-inner">
            <CalendarIcon size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white pink-text-glow uppercase tracking-tighter leading-none">{t.calendar}</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              <Target size={14} className="text-pink-500" />
              {t.cal.briefing}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button onClick={goToToday} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-pink-500 hover:bg-pink-600 hover:text-white transition-all shadow-lg font-black text-[10px] uppercase tracking-widest">
             {t.cal.today}
          </button>
          
          <div className="flex items-center gap-2 bg-black border border-white/5 rounded-2xl p-1 shadow-inner">
             <button onClick={prevMonth} className="p-3 text-slate-400 hover:text-pink-500 hover:bg-white/5 rounded-xl transition-all"><ChevronLeft size={20} /></button>
             <h3 className="text-xs font-black text-white px-8 uppercase tracking-[0.2em] min-w-[180px] text-center">
               {lang === 'ru' ? monthNames[viewDate.getMonth()] : monthNamesEn[viewDate.getMonth()]} {viewDate.getFullYear()}
             </h3>
             <button onClick={nextMonth} className="p-3 text-slate-400 hover:text-pink-500 hover:bg-white/5 rounded-xl transition-all"><ChevronRight size={20} /></button>
          </div>

          {isCaptain && (
            <button 
              onClick={() => openAddModal()}
              className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase transition-all shadow-lg shadow-pink-600/30 flex items-center gap-2 active:scale-95"
            >
              <Plus size={18} />
              {t.addEvent}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <div className="bg-[#050505] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative">
            <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.02]">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="py-6 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarGrid.map((item, i) => {
                const itemDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + item.monthOffset, item.day);
                const dateStr = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`;
                const dayEvents = events.filter(e => e.date === dateStr);
                const isToday = today.toDateString() === itemDate.toDateString();

                return (
                  <div 
                    key={i} 
                    className={`min-h-[160px] border-r border-b border-white/5 p-4 relative transition-all group ${i % 7 === 6 ? 'border-r-0' : ''} ${!item.currentMonth ? 'bg-black/50 opacity-20 pointer-events-none' : 'hover:bg-pink-600/[0.03] cursor-pointer'}`}
                    onClick={() => item.currentMonth && isCaptain && openAddModal(dateStr)}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-[13px] font-black w-8 h-8 flex items-center justify-center rounded-xl transition-all shadow-sm ${isToday ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] scale-110' : 'text-slate-600'}`}>
                        {item.day}
                      </span>
                      {isCaptain && item.currentMonth && (
                         <Plus size={12} className="text-pink-600/0 group-hover:text-pink-600 transition-all transform group-hover:rotate-90" />
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      {dayEvents.map(ev => (
                        <div 
                          key={ev.id} 
                          onClick={(e) => { e.stopPropagation(); if (isCaptain) openEditModal(ev); }}
                          className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase truncate transition-all border shadow-lg ${
                            ev.priority === 'High' 
                            ? 'bg-pink-600/10 border-pink-500/40 text-pink-500 hover:bg-pink-600/20' 
                            : 'bg-blue-600/10 border-blue-500/40 text-blue-500 hover:bg-blue-600/20'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${ev.priority === 'High' ? 'bg-pink-500' : 'bg-blue-500'} animate-pulse`}></div>
                            {ev.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-pink-600/5 border border-pink-500/10 p-6 rounded-[2.5rem] shadow-xl">
             <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
               <ClipboardList size={16} className="text-pink-500" />
               {t.activeMissions}
             </h3>
             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
              {events.length === 0 ? (
                <div className="text-center py-16 opacity-30 italic text-sm">
                  <AlertTriangle size={32} className="mx-auto mb-3" />
                  {lang === 'ru' ? 'Событий на радаре нет' : 'No events on radar'}
                </div>
              ) : events
                  .sort((a,b) => a.date.localeCompare(b.date))
                  .map((ev) => (
                <div key={ev.id} className="bg-black/40 border border-white/5 p-5 rounded-3xl hover:border-pink-500/30 transition-all border-l-4 border-l-pink-600 group relative">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-white text-[11px] uppercase tracking-tight pr-4">{ev.title}</h4>
                    {isCaptain && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(ev)} className="p-1.5 hover:text-blue-400 text-slate-600 transition-colors"><Edit2 size={14}/></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(ev.id); }} className="p-1.5 hover:text-red-500 text-slate-600 transition-colors"><Trash2 size={14}/></button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                      <CalendarIcon size={12} className="text-pink-600" />
                      {ev.date}
                    </div>
                    {ev.location && (
                      <div className="flex items-center gap-2 text-[9px] text-slate-600 font-bold uppercase tracking-widest italic truncate">
                        <MapPin size={12} className="text-slate-800" />
                        {ev.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
             </div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-900/10 to-black border border-pink-500/20 p-8 rounded-[2.5rem] text-center">
             <Target className="text-pink-500 mx-auto mb-4" size={32} />
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{t.syncStatus}</p>
             <p className="text-[10px] text-slate-600 mt-2 italic font-medium">{t.syncDesc}</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
           <div className="bg-[#0a0a0a] border border-pink-500/30 rounded-[3.5rem] p-10 w-full max-w-xl shadow-[0_0_150px_rgba(236,72,153,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/5 blur-[80px] -mr-32 -mt-32"></div>
              
              <div className="flex justify-between items-center mb-10 relative">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    {editingEvent ? <Edit2 size={24} /> : <Plus size={24} />}
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase pink-text-glow tracking-tighter">
                    {editingEvent ? t.editEvent : t.addEvent}
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-600 hover:text-white transition-colors p-2 bg-white/5 rounded-full"><X size={32}/></button>
              </div>

              <div className="space-y-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-black text-pink-500 uppercase mb-3 tracking-[0.3em] ml-1">{t.eventTitle}</label>
                    <input 
                      value={formTitle} 
                      onChange={e => setFormTitle(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 text-white text-lg font-bold outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all" 
                      placeholder="e.g. Robot Scrimmage" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-black text-pink-500 uppercase mb-3 tracking-[0.3em] ml-1">{t.date}</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                      <input 
                        type="date" 
                        value={formDate} 
                        onChange={e => setFormDate(e.target.value)} 
                        className="w-full bg-black border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white text-sm font-bold outline-none focus:border-pink-500 transition-all appearance-none" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-pink-500 uppercase mb-3 tracking-[0.3em] ml-1">{t.priority}</label>
                    <select 
                      value={formPriority} 
                      onChange={e => setFormPriority(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 text-white text-sm font-bold outline-none focus:border-pink-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="High">{t.cal.high} PRIORITY</option>
                      <option value="Medium">{t.cal.medium} PRIORITY</option>
                      <option value="Low">{t.cal.low} PRIORITY</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-black text-pink-500 uppercase mb-3 tracking-[0.3em] ml-1">{t.location}</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input 
                        value={formLocation} 
                        onChange={e => setFormLocation(e.target.value)} 
                        className="w-full bg-black border border-white/10 rounded-2xl pl-16 pr-8 py-5 text-white text-sm font-bold outline-none focus:border-pink-500 transition-all" 
                        placeholder="Workshop / Online / School" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 pt-10">
                  {editingEvent && (
                    <button onClick={() => { handleDelete(editingEvent.id); setIsModalOpen(false); }} className="flex-1 py-5 text-red-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">
                      {t.delete}
                    </button>
                  )}
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">
                    {t.cancel}
                  </button>
                  <button 
                    onClick={handleSave} 
                    disabled={!formTitle || !formDate}
                    className="flex-[2] bg-pink-600 hover:bg-pink-500 disabled:opacity-30 text-white py-5 px-10 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-[0_20px_40px_rgba(236,72,153,0.3)] transition-all active:scale-95"
                  >
                    {t.saveMission}
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeamCalendar;
