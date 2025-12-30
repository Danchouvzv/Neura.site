import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  title: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
  gradient: string;
  link: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, description, cta, icon, gradient, link }) => {
  return (
    <div className="group relative p-[1px] rounded-[32px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden transition-all duration-700 hover:scale-[1.02] sm:hover:scale-[1.05] hover:-translate-y-2 sm:hover:-translate-y-4">
      <div className={`absolute inset-0 bg-[#ff007f] opacity-10 group-hover:opacity-100 transition-opacity duration-700`} />
      
      <div className="relative h-full bg-[#030303] rounded-[31px] sm:rounded-[39px] md:rounded-[49px] p-6 sm:p-8 md:p-12 flex flex-col border border-white/5">
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-[#ff007f]/10 flex items-center justify-center text-[#ff007f] mb-6 sm:mb-8 md:mb-10 shadow-[0_0_30px_rgba(255,0,127,0.05)] group-hover:bg-[#ff007f] group-hover:text-black transition-all duration-500">
          <div className="group-hover:scale-125 transition-transform duration-500 scale-90 sm:scale-100">
            {icon}
          </div>
        </div>
        
        <h3 className="font-tech text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 tracking-tighter text-white group-hover:text-[#ff007f] transition-colors">{title}</h3>
        <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 md:mb-12 flex-grow font-medium group-hover:text-white/60 transition-colors">
          {description}
        </p>
        
        <Link 
          to={link}
          className="relative w-full py-4 sm:py-5 md:py-6 rounded-2xl sm:rounded-3xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] overflow-hidden group/btn border border-[#ff007f]/30 transition-all hover:border-[#ff007f] hover:shadow-[0_0_30px_rgba(255,0,127,0.2)] text-center min-h-[44px] flex items-center justify-center"
        >
          <div className={`absolute inset-0 bg-[#ff007f] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500`} />
          <span className="relative z-10 text-[#ff007f] group-hover/btn:text-black transition-colors duration-500">{cta}</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
