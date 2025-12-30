import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ACHIEVEMENTS, TEAM_ROLES } from './LandingPage/constants';
import Background from './LandingPage/Background';
import Navbar from './LandingPage/Navbar';
import Hero from './LandingPage/Hero';
import ProductCard from './LandingPage/ProductCard';
import StatsSection from './LandingPage/StatsSection';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 50;
      setScrolled(prev => (prev === next ? prev : next));
    };
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setPrefersReducedMotion(motionQuery.matches);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Supabase auth
  useEffect(() => {
    let mounted = true;
    
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setUser(data.session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginToggle = () => {
    if (user) {
      navigate('/hub');
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-[#ff007f] selection:text-white bg-black">
      <Background prefersReducedMotion={prefersReducedMotion} />
      <Navbar 
        scrolled={scrolled} 
        isLoggedIn={!!user} 
        onLoginToggle={handleLoginToggle} 
      />

      <main className="relative z-10">
        <Hero />

        {/* Community Systems Section */}
        <section id="products" className="px-4 sm:px-6 pt-32 sm:pt-40 md:pt-60 pb-20 sm:pb-32 md:pb-40 space-y-16 sm:space-y-24 md:space-y-32">
          <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl mx-auto">
            <div className="inline-block px-3 sm:px-4 py-1 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/30 text-[#ff007f] text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] uppercase mb-2 sm:mb-4">
              Integrated Platforms
            </div>
            <h2 className="font-tech text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-black tracking-tighter text-white uppercase px-2">THE COMMUNITY <br/><span className="text-[#ff007f]">OPERATING SYSTEM</span></h2>
            <p className="text-white/40 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-4">Professional-grade infrastructure designed for the Kazakh FTC landscape.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto">
            <ProductCard 
              title="Карта Команд"
              description="Coordinate with teams across the meridian. A high-fidelity real-time visualization of the global FTC network."
              cta="Открыть Карту"
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              gradient="from-[#ff007f] to-[#ff007f88]"
              link="/map"
            />
            <ProductCard 
              title="Q&A Форум"
              description="A decentralized knowledge base. Engage in technical dialogue and problem-solving at professional scale."
              cta="Открыть Форум"
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>}
              gradient="from-[#ff007f] to-[#ff8c0088]"
              link="/qa"
            />
            <ProductCard 
              title="TeamHub"
              description="The nervous system of your team. Agile task management, resource tracking, and high-concurrency planning."
              cta={user ? "Открыть Hub" : "Войти в систему"}
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
              gradient="from-[#ff007f] to-[#000]"
              link={user ? "/hub" : "/signin"}
            />
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="px-4 sm:px-6 py-20 sm:py-32 md:py-40 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-24 items-center">
            <div className="space-y-8 sm:space-y-12 md:space-y-16">
              <div className="space-y-4 sm:space-y-6">
                <div className="text-[#ff007f] text-[10px] sm:text-xs font-black tracking-[0.6em] sm:tracking-[0.8em] uppercase mb-2 sm:mb-4">Engineering Manifesto</div>
                <h2 className="font-tech text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black leading-[0.85] tracking-tighter uppercase">
                  CRAFTING THE <br />
                  <span className="text-white/20">FUTURE</span>
                </h2>
                <div className="h-1.5 sm:h-2 w-24 sm:w-32 bg-[#ff007f] rounded-full shadow-[0_0_20px_#ff007f]" />
            </div>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 leading-snug font-light italic border-l-4 sm:border-l-8 border-[#ff007f] pl-4 sm:pl-6 md:pl-10">
                "We don't just build robots; we architect the infrastructure of innovation."
              </p>
              
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10">
                {[
                  { id: 'CODE', title: 'Algorithmic Rigor', color: 'text-[#ff007f]', desc: 'Every line of code is a commitment to performance and scalability.' },
                  { id: 'MECH', title: 'Structural Integrity', color: 'text-white', desc: 'Engineering mechanisms that withstand the friction of reality.' },
                  { id: 'SYNC', title: 'Community Synergy', color: 'text-[#ff8c00]', desc: 'Open protocols for shared progress across the Kazakh FIRST ecosystem.' },
                ].map(item => (
                  <div key={item.id} className="group flex items-start gap-4 sm:gap-6 md:gap-8 p-5 sm:p-6 md:p-8 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-[#ff007f33] transition-all hover:bg-white/[0.05]">
                    <div className={`text-xs sm:text-sm font-black font-tech tracking-widest ${item.color} mt-1 shrink-0`}>{item.id}</div>
                    <div>
                      <h4 className="font-black text-lg sm:text-xl md:text-2xl mb-2 tracking-tight">{item.title}</h4>
                      <p className="text-sm sm:text-base text-white/40 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
              </div>
            </div>

            <div className="relative aspect-[3/4] rounded-[32px] sm:rounded-[48px] md:rounded-[64px] lg:rounded-[80px] overflow-hidden border border-[#ff007f11] group shadow-[0_0_80px_rgba(255,0,127,0.1)]">
              <img 
                src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=800" 
                alt="Neura Lab" 
                className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12 md:bottom-16 md:left-16 md:right-16 p-6 sm:p-8 md:p-12 backdrop-blur-3xl bg-black/80 border border-[#ff007f33] rounded-[24px] sm:rounded-[32px] md:rounded-[50px]">
                <div className="font-tech text-[#ff007f] text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.4em] sm:tracking-[0.5em] md:tracking-[0.6em] uppercase mb-3 sm:mb-4 md:mb-6">HQ: ALMATY NAURYZBAY</div>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-black leading-tight tracking-tight uppercase">NEURA: The Central Nervous System of Team Excellence.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Timeline */}
        <section id="achievements" className="px-4 sm:px-6 py-20 sm:py-32 md:py-40 bg-white/[0.01] border-y border-[#ff007f11]">
          <div className="text-center mb-16 sm:mb-24 md:mb-32 space-y-4 sm:space-y-6">
             <div className="inline-block px-3 sm:px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] uppercase">Archive Season 2024</div>
            <h2 className="font-tech text-3xl sm:text-4xl md:text-6xl lg:text-9xl font-black tracking-tighter text-white uppercase px-2">THE LOG <span className="text-[#ff007f]">01</span></h2>
            </div>

          <div className="relative space-y-12 sm:space-y-16 max-w-6xl mx-auto">
            <div className="absolute left-4 sm:left-6 md:left-8 lg:left-1/2 top-0 bottom-0 w-[2px] sm:w-[3px] md:w-[4px] bg-gradient-to-b from-[#ff007f] via-[#ff007f11] to-transparent opacity-30" />
            
            {ACHIEVEMENTS.map((ach, idx) => (
              <div key={ach.id} className={`flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="w-full md:w-1/2 flex justify-center md:justify-end px-2 sm:px-4 md:px-0">
                  <div className={`group p-6 sm:p-8 md:p-12 rounded-[24px] sm:rounded-[32px] md:rounded-[50px] bg-black border border-[#ff007f22] w-full hover:border-[#ff007f] hover:shadow-[0_0_60px_rgba(255,0,127,0.2)] transition-all duration-500 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 ${idx % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <span className="px-3 sm:px-4 py-1 rounded-full bg-[#ff007f] text-black text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-widest uppercase">{ach.category}</span>
                      <span className="text-white/30 font-black text-[10px] sm:text-xs">{ach.year}</span>
                    </div>
                    <h3 className="font-tech text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 tracking-tighter text-white group-hover:text-[#ff007f] transition-colors">{ach.title}</h3>
                    {ach.award && <div className="text-[#ff007f] font-black mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base uppercase tracking-[0.2em]">{ach.award}</div>}
                    <p className="text-white/50 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 leading-relaxed font-medium">{ach.description}</p>
                    <div className="pt-4 sm:pt-6 md:pt-8 border-t border-[#ff007f22] space-y-2 sm:space-y-3 md:space-y-4">
                      <div className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/20 font-black">Memory Log</div>
                      <p className="text-xs sm:text-sm text-white/70 italic font-medium leading-relaxed">"{ach.learnings}"</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute left-4 sm:left-6 md:left-8 lg:left-1/2 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-black border-[3px] sm:border-[4px] border-[#ff007f] rounded-full z-10 shadow-[0_0_30px_#ff007f]" />
                
                <div className="hidden md:block w-1/2" />
              </div>
            ))}
          </div>
        </section>

        {/* Team Architecture */}
        <section id="team" className="px-4 sm:px-6 py-20 sm:py-32 md:py-40 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 md:mb-24">
            <div className="space-y-4 sm:space-y-6">
               <div className="text-[#ff007f] text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.6em] sm:tracking-[0.7em] md:tracking-[0.8em] uppercase">Human Resources</div>
              <h2 className="font-tech text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white uppercase">THE ARCHITECTURE</h2>
              <p className="text-white/40 text-base sm:text-lg md:text-xl lg:text-2xl font-medium">Modular specialized units synced for maximum community output.</p>
            </div>
                  </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {Object.entries(TEAM_ROLES).map(([key, role]: [string, any]) => (
              <div key={key} className="group p-6 sm:p-8 md:p-12 rounded-[32px] sm:rounded-[40px] md:rounded-[60px] bg-white/[0.01] border border-white/5 hover:border-[#ff007f] transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-4 hover:bg-black">
                <div className="mb-6 sm:mb-8 md:mb-10 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-[#ff007f]/10 flex items-center justify-center text-[#ff007f] group-hover:scale-110 group-hover:bg-[#ff007f] group-hover:text-black transition-all shadow-[0_0_20px_rgba(255,0,127,0.1)]">
                  <div className="scale-75 sm:scale-90 md:scale-100">{role.icon}</div>
                </div>
                <h3 className="font-tech text-xl sm:text-2xl md:text-3xl font-black mb-4 sm:mb-6 tracking-tighter text-white uppercase">{role.title}</h3>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 md:mb-10 font-medium">{role.description}</p>
                <div className="flex gap-3 sm:gap-4 opacity-20 text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#ff007f]">
                  <span>LOGIC</span> • <span>STEEL</span> • <span>HYPE</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32">
             <StatsSection />
          </div>
        </section>

        {/* Project Releases */}
        <section className="px-4 sm:px-6 py-20 sm:py-32 md:py-40 max-w-7xl mx-auto">
          <div className="relative p-8 sm:p-12 md:p-20 lg:p-32 rounded-[32px] sm:rounded-[48px] md:rounded-[64px] lg:rounded-[80px] bg-gradient-to-br from-[#050505] via-black to-[#050505] border border-[#ff007f22] text-center space-y-8 sm:space-y-12 md:space-y-16 overflow-hidden shadow-[0_0_100px_rgba(255,0,127,0.05)]">
            <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-[#ff007f08] blur-[150px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-[#ff007f08] blur-[150px] rounded-full" />
            
            <h2 className="relative z-10 font-tech text-2xl sm:text-3xl md:text-4xl lg:text-8xl font-black tracking-tighter max-w-4xl mx-auto leading-[0.9] text-white uppercase px-4">
              INITIALIZE <span className="text-[#ff007f]">COMMUNITY</span> PROTOCOLS
              </h2>
            
            <div className="relative z-10 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 px-4">
              {['NeuraBot v1.0', 'FTC Lexicon', 'Community Portal', 'TeamStack OS'].map(work => (
                <div key={work} className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl sm:rounded-3xl bg-black border border-[#ff007f33] font-black text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#ff007f] hover:bg-[#ff007f] hover:text-black transition-all cursor-pointer shadow-[0_0_20px_rgba(255,0,127,0.1)] min-h-[44px] flex items-center justify-center">
                  {work}
                </div>
              ))}
            </div>
            
            <p className="relative z-10 text-white/40 max-w-2xl mx-auto italic font-medium text-sm sm:text-base md:text-lg leading-relaxed px-4">
              "NEURA represents the neural network of Kazakh engineering—a distributed system of talent, code, and vision."
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 pt-20 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20 border-t border-[#ff007f11] bg-black/60 backdrop-blur-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 sm:gap-16 md:gap-24 mb-16 sm:mb-24 md:mb-32 max-w-7xl mx-auto">
            <div className="col-span-1 sm:col-span-2 md:col-span-2 space-y-6 sm:space-y-8 md:space-y-10">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#ff007f] rounded-xl sm:rounded-2xl flex items-center justify-center font-tech font-black text-black text-xl sm:text-2xl shadow-[0_0_30px_rgba(255,0,127,0.4)]">N</div>
                <span className="font-tech text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">NEURA</span>
              </div>
              <p className="text-white/40 max-w-sm text-sm sm:text-base md:text-lg leading-relaxed font-medium italic">
                Architecting the pulse of robotics from Almaty to the global stage.
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <h5 className="font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] md:tracking-[0.6em] text-[#ff007f]">Protocol</h5>
              <ul className="text-white/40 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] space-y-3 sm:space-y-4 md:space-y-5">
                <li><Link to="/hub" className="hover:text-[#ff007f] transition-all block">Team Hub</Link></li>
                <li><Link to="/map" className="hover:text-[#ff007f] transition-all block">Nexus Map</Link></li>
                <li><Link to="/qa" className="hover:text-[#ff007f] transition-all block">Q&A Forum</Link></li>
              </ul>
              </div>

            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <h5 className="font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] md:tracking-[0.6em] text-[#ff007f]">HQ Nodes</h5>
              <p className="text-white/40 text-xs sm:text-sm leading-relaxed font-medium uppercase tracking-widest">
                NIS Almaty Nauryzbay<br />
                Node ID: ALM-2024<br />
                Kazakhstan
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-10 pt-8 sm:pt-12 md:pt-16 border-t border-white/5 max-w-7xl mx-auto">
            <p className="text-white/20 text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase text-center sm:text-left">© 2024 NEURA_LABS. COMMUNITY_SYNC_ACTIVE</p>
            <div className="flex items-center gap-6 sm:gap-8 md:gap-12">
               <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 sm:w-10 h-0.5 sm:h-1 bg-[#ff007f] rounded-full shadow-[0_0_10px_#ff007f]" />
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] uppercase text-[#ff007f]">System Operational</span>
               </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
