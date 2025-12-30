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
    <div className="group relative p-[1px] rounded-[50px] overflow-hidden transition-all duration-700 hover:scale-[1.05] hover:-translate-y-4">
      <div className={`absolute inset-0 bg-[#ff007f] opacity-10 group-hover:opacity-100 transition-opacity duration-700`} />
      
      <div className="relative h-full bg-[#030303] rounded-[49px] p-12 flex flex-col border border-white/5">
        <div className="w-20 h-20 rounded-3xl bg-[#ff007f]/10 flex items-center justify-center text-[#ff007f] mb-10 shadow-[0_0_30px_rgba(255,0,127,0.05)] group-hover:bg-[#ff007f] group-hover:text-black transition-all duration-500">
          <div className="group-hover:scale-125 transition-transform duration-500">
            {icon}
          </div>
        </div>
        
        <h3 className="font-tech text-4xl font-black mb-6 tracking-tighter text-white group-hover:text-[#ff007f] transition-colors">{title}</h3>
        <p className="text-white/40 text-base leading-relaxed mb-12 flex-grow font-medium group-hover:text-white/60 transition-colors">
          {description}
        </p>
        
        <Link 
          to={link}
          className="relative w-full py-6 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] overflow-hidden group/btn border border-[#ff007f]/30 transition-all hover:border-[#ff007f] hover:shadow-[0_0_30px_rgba(255,0,127,0.2)] text-center"
        >
          <div className={`absolute inset-0 bg-[#ff007f] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500`} />
          <span className="relative z-10 text-[#ff007f] group-hover/btn:text-black transition-colors duration-500">{cta}</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
