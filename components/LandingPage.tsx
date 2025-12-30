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
        <section id="products" className="px-6 pt-60 pb-40 space-y-32">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/30 text-[#ff007f] text-[10px] font-black tracking-[0.5em] uppercase mb-4">
              Integrated Platforms
            </div>
            <h2 className="font-tech text-5xl md:text-8xl font-black tracking-tighter text-white uppercase">THE COMMUNITY <br/><span className="text-[#ff007f]">OPERATING SYSTEM</span></h2>
            <p className="text-white/40 text-xl max-w-2xl mx-auto font-medium leading-relaxed">Professional-grade infrastructure designed for the Kazakh FTC landscape.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
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
        <section id="mission" className="px-6 py-40 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-16">
              <div className="space-y-6">
                <div className="text-[#ff007f] text-xs font-black tracking-[0.8em] uppercase mb-4">Engineering Manifesto</div>
                <h2 className="font-tech text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase">
                  CRAFTING THE <br />
                  <span className="text-white/20">FUTURE</span>
                </h2>
                <div className="h-2 w-32 bg-[#ff007f] rounded-full shadow-[0_0_20px_#ff007f]" />
            </div>

              <p className="text-3xl text-white/80 leading-snug font-light italic border-l-8 border-[#ff007f] pl-10">
                "We don't just build robots; we architect the infrastructure of innovation."
              </p>
              
              <div className="grid grid-cols-1 gap-10">
                {[
                  { id: 'CODE', title: 'Algorithmic Rigor', color: 'text-[#ff007f]', desc: 'Every line of code is a commitment to performance and scalability.' },
                  { id: 'MECH', title: 'Structural Integrity', color: 'text-white', desc: 'Engineering mechanisms that withstand the friction of reality.' },
                  { id: 'SYNC', title: 'Community Synergy', color: 'text-[#ff8c00]', desc: 'Open protocols for shared progress across the Kazakh FIRST ecosystem.' },
                ].map(item => (
                  <div key={item.id} className="group flex items-start gap-8 p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-[#ff007f33] transition-all hover:bg-white/[0.05]">
                    <div className={`text-sm font-black font-tech tracking-widest ${item.color} mt-1`}>{item.id}</div>
                    <div>
                      <h4 className="font-black text-2xl mb-2 tracking-tight">{item.title}</h4>
                      <p className="text-base text-white/40 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
              </div>
            </div>

            <div className="relative aspect-[3/4] rounded-[80px] overflow-hidden border border-[#ff007f11] group shadow-[0_0_80px_rgba(255,0,127,0.1)]">
              <img 
                src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=800" 
                alt="Neura Lab" 
                className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-16 left-16 right-16 p-12 backdrop-blur-3xl bg-black/80 border border-[#ff007f33] rounded-[50px]">
                <div className="font-tech text-[#ff007f] text-[10px] font-black tracking-[0.6em] uppercase mb-6">HQ: ALMATY NAURYZBAY</div>
                <p className="text-2xl font-black leading-tight tracking-tight uppercase">NEURA: The Central Nervous System of Team Excellence.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Timeline */}
        <section id="achievements" className="px-6 py-40 bg-white/[0.01] border-y border-[#ff007f11]">
          <div className="text-center mb-32 space-y-6">
             <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black tracking-[0.5em] uppercase">Archive Season 2024</div>
            <h2 className="font-tech text-6xl md:text-9xl font-black tracking-tighter text-white uppercase">THE LOG <span className="text-[#ff007f]">01</span></h2>
            </div>

          <div className="relative space-y-16 max-w-6xl mx-auto">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#ff007f] via-[#ff007f11] to-transparent opacity-30" />
            
            {ACHIEVEMENTS.map((ach, idx) => (
              <div key={ach.id} className={`flex flex-col md:flex-row items-center gap-16 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="w-full md:w-1/2 flex justify-center md:justify-end px-4 md:px-0">
                  <div className={`group p-12 rounded-[50px] bg-black border border-[#ff007f22] w-full hover:border-[#ff007f] hover:shadow-[0_0_60px_rgba(255,0,127,0.2)] transition-all duration-500 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="flex items-center gap-4 mb-6 md:justify-end">
                      <span className="px-4 py-1 rounded-full bg-[#ff007f] text-black text-[10px] font-black tracking-widest uppercase">{ach.category}</span>
                      <span className="text-white/30 font-black text-xs">{ach.year}</span>
                    </div>
                    <h3 className="font-tech text-3xl font-black mb-4 tracking-tighter text-white group-hover:text-[#ff007f] transition-colors">{ach.title}</h3>
                    {ach.award && <div className="text-[#ff007f] font-black mb-8 text-base uppercase tracking-[0.2em]">{ach.award}</div>}
                    <p className="text-white/50 text-lg mb-10 leading-relaxed font-medium">{ach.description}</p>
                    <div className="pt-8 border-t border-[#ff007f22] space-y-4">
                      <div className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Memory Log</div>
                      <p className="text-sm text-white/70 italic font-medium leading-relaxed">"{ach.learnings}"</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-black border-[4px] border-[#ff007f] rounded-full z-10 shadow-[0_0_30px_#ff007f]" />
                
                <div className="hidden md:block w-1/2" />
              </div>
            ))}
          </div>
        </section>

        {/* Team Architecture */}
        <section id="team" className="px-6 py-40 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
            <div className="space-y-6">
               <div className="text-[#ff007f] text-[10px] font-black tracking-[0.8em] uppercase">Human Resources</div>
              <h2 className="font-tech text-6xl md:text-8xl font-black tracking-tighter text-white uppercase">THE ARCHITECTURE</h2>
              <p className="text-white/40 text-2xl font-medium">Modular specialized units synced for maximum community output.</p>
            </div>
                  </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {Object.entries(TEAM_ROLES).map(([key, role]: [string, any]) => (
              <div key={key} className="group p-12 rounded-[60px] bg-white/[0.01] border border-white/5 hover:border-[#ff007f] transition-all duration-500 hover:-translate-y-4 hover:bg-black">
                <div className="mb-10 w-20 h-20 rounded-3xl bg-[#ff007f]/10 flex items-center justify-center text-[#ff007f] group-hover:scale-110 group-hover:bg-[#ff007f] group-hover:text-black transition-all shadow-[0_0_20px_rgba(255,0,127,0.1)]">
                  {role.icon}
                </div>
                <h3 className="font-tech text-3xl font-black mb-6 tracking-tighter text-white uppercase">{role.title}</h3>
                <p className="text-white/50 text-base leading-relaxed mb-10 font-medium">{role.description}</p>
                <div className="flex gap-4 opacity-20 text-[10px] font-black tracking-[0.4em] uppercase text-[#ff007f]">
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
        <section className="px-6 py-40 max-w-7xl mx-auto">
          <div className="relative p-20 md:p-32 rounded-[80px] bg-gradient-to-br from-[#050505] via-black to-[#050505] border border-[#ff007f22] text-center space-y-16 overflow-hidden shadow-[0_0_100px_rgba(255,0,127,0.05)]">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff007f08] blur-[150px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#ff007f08] blur-[150px] rounded-full" />
            
            <h2 className="relative z-10 font-tech text-4xl md:text-8xl font-black tracking-tighter max-w-4xl mx-auto leading-[0.9] text-white uppercase">
              INITIALIZE <span className="text-[#ff007f]">COMMUNITY</span> PROTOCOLS
              </h2>
            
            <div className="relative z-10 flex flex-wrap justify-center gap-8">
              {['NeuraBot v1.0', 'FTC Lexicon', 'Community Portal', 'TeamStack OS'].map(work => (
                <div key={work} className="px-10 py-5 rounded-3xl bg-black border border-[#ff007f33] font-black text-xs uppercase tracking-[0.3em] text-[#ff007f] hover:bg-[#ff007f] hover:text-black transition-all cursor-pointer shadow-[0_0_20px_rgba(255,0,127,0.1)]">
                  {work}
                </div>
              ))}
            </div>
            
            <p className="relative z-10 text-white/40 max-w-2xl mx-auto italic font-medium text-lg leading-relaxed">
              "NEURA represents the neural network of Kazakh engineering—a distributed system of talent, code, and vision."
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 pt-40 pb-20 border-t border-[#ff007f11] bg-black/60 backdrop-blur-3xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-32 max-w-7xl mx-auto">
            <div className="col-span-1 md:col-span-2 space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#ff007f] rounded-2xl flex items-center justify-center font-tech font-black text-black text-2xl shadow-[0_0_30px_rgba(255,0,127,0.4)]">N</div>
                <span className="font-tech text-4xl font-black tracking-tighter text-white uppercase">NEURA</span>
              </div>
              <p className="text-white/40 max-w-sm text-lg leading-relaxed font-medium italic">
                Architecting the pulse of robotics from Almaty to the global stage.
              </p>
            </div>
            
            <div className="space-y-8">
              <h5 className="font-black text-[10px] uppercase tracking-[0.6em] text-[#ff007f]">Protocol</h5>
              <ul className="text-white/40 text-xs font-black uppercase tracking-[0.3em] space-y-5">
                <li><Link to="/hub" className="hover:text-[#ff007f] transition-all">Team Hub</Link></li>
                <li><Link to="/map" className="hover:text-[#ff007f] transition-all">Nexus Map</Link></li>
                <li><Link to="/qa" className="hover:text-[#ff007f] transition-all">Q&A Forum</Link></li>
              </ul>
              </div>

            <div className="space-y-8">
              <h5 className="font-black text-[10px] uppercase tracking-[0.6em] text-[#ff007f]">HQ Nodes</h5>
              <p className="text-white/40 text-sm leading-relaxed font-medium uppercase tracking-widest">
                NIS Almaty Nauryzbay<br />
                Node ID: ALM-2024<br />
                Kazakhstan
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-16 border-t border-white/5 max-w-7xl mx-auto">
            <p className="text-white/20 text-[10px] font-black tracking-[0.4em] uppercase">© 2024 NEURA_LABS. COMMUNITY_SYNC_ACTIVE</p>
            <div className="flex items-center gap-12">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-1 bg-[#ff007f] rounded-full shadow-[0_0_10px_#ff007f]" />
                  <span className="text-[10px] font-black tracking-[0.5em] uppercase text-[#ff007f]">System Operational</span>
               </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
