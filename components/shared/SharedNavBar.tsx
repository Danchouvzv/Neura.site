import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from '../../lib/supabaseClient';

type SharedNavBarProps = {
  user?: any;
};

const navItems = [
  { label: "Карта", to: "/map" },
  { label: "Q&A", to: "/qa" },
  { label: "TeamHub", to: "/hub" },
];

const SharedNavBar: React.FC<SharedNavBarProps> = ({ user: propUser }) => {
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(propUser || null);
  const [scrolled, setScrolled] = useState(false);

  // Get user from Supabase if not provided
  useEffect(() => {
    if (!propUser) {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ?? null);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    }
  }, [propUser]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 50;
      setScrolled(prev => (prev === next ? prev : next));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");

  // Close on Escape + lock body scroll when menu open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navClass = useMemo(() => {
    return [
      "fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto",
      "transition-all duration-300",
      "backdrop-blur-xl",
      "rounded-2xl",
      scrolled
        ? "bg-black/70 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        : "bg-black/25 border border-white/5",
    ].join(" ");
  }, [scrolled]);

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.src.includes('logos/neura-logo.jpeg')) {
      img.src = 'neura-logo.jpeg';
    } else {
      img.style.display = 'none';
    }
  };

  return (
    <header className={navClass}>
      {/* Gradient blur effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-neura-pink/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-50 pointer-events-none"></div>
      
      <div className="relative px-4 md:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="group flex items-center gap-3" aria-label="NEURA - На главную">
            <span className="relative h-9 w-9 rounded-xl border border-white/10 bg-black/40 overflow-hidden">
              <img 
                src="/logos/neura-logo.jpeg" 
                alt=""
                className="h-full w-full object-cover"
                onError={handleLogoError}
              />
              <span className="absolute inset-0 bg-gradient-to-br from-neura-pink/30 via-purple-500/20 to-cyan-500/20 opacity-70" />
              <span className="absolute -inset-6 blur-2xl bg-neura-pink/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>

            <span className="flex items-center gap-2">
              <span className="font-display font-black tracking-tight text-white">NEURA</span>
              <span className="hidden sm:inline text-xs font-mono text-white/50">FTC</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Основная навигация">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  "relative px-4 py-2 rounded-xl text-sm font-display font-bold transition-all",
                  "text-white/75 hover:text-white hover:bg-white/5",
                  isActive(item.to) ? "text-white bg-white/5" : "",
                ].join(" ")}
                aria-current={isActive(item.to) ? "page" : undefined}
              >
                {item.label}
                {isActive(item.to) && (
                  <span className="absolute left-3 right-3 -bottom-[6px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-neura-pink to-transparent opacity-90" />
                )}
              </Link>
            ))}

            <Link
              to={user ? "/hub" : "/signin"}
              className="ml-2 inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-display font-black
                         bg-neura-pink/20 hover:bg-neura-pink/30 border border-neura-pink/40 hover:border-neura-pink/70
                         text-neura-pink hover:text-white transition-all"
            >
              {user ? "Открыть Hub" : "Войти"}
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <div className="flex flex-col gap-1">
              <span className={`h-0.5 w-5 bg-white transition ${isMenuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`h-0.5 w-5 bg-white transition ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`h-0.5 w-5 bg-white transition ${isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            ref={panelRef}
            className="fixed top-20 left-4 right-4 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-4"
            role="menu"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={[
                    "px-4 py-3 rounded-xl text-sm font-display font-bold transition",
                    "text-white/80 hover:text-white hover:bg-white/5",
                    isActive(item.to) ? "bg-white/5 text-white" : "",
                  ].join(" ")}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to={user ? "/hub" : "/signin"}
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl text-sm font-display font-black bg-neura-pink/25 border border-neura-pink/50 text-neura-pink hover:text-white hover:bg-neura-pink/35 transition"
                role="menuitem"
              >
                {user ? "Открыть Hub" : "Войти"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

SharedNavBar.displayName = 'SharedNavBar';

export default SharedNavBar;

