import React from 'react';
import { UserKitchenProfile } from '../types';

interface NavbarProps {
  activeScreen: 'home' | 'cook' | 'recommendations' | 'scan' | 'healthy' | 'saved' | 'profile';
  onNavigate: (screen: 'home' | 'cook' | 'recommendations' | 'scan' | 'healthy' | 'saved' | 'profile') => void;
  userProfile: UserKitchenProfile;
  onOpenOnboarding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  userProfile
}) => {
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'cook', label: 'Cook' },
    { id: 'scan', label: 'Scan' },
    { id: 'healthy', label: 'Healthy' },
    { id: 'saved', label: 'Saved' },
    { id: 'profile', label: 'Profile' }
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-[#183B2B]/8 bg-[#FBF9F5]/82 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6">
        <button
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2.5 text-left"
        >
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl bg-[#183B2B] text-white shadow-[0_8px_22px_rgba(24,59,43,0.18)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <div className="absolute inset-[5px] rounded-full border border-white/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#F28A54] shadow-[0_0_12px_rgba(242,138,84,0.8)]" />
          </div>
          <div>
            <div className="text-[20px] font-extrabold leading-none tracking-[-0.03em] text-[#183B2B]">SavorAI</div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#183B2B]/42">Kitchen intelligence</div>
          </div>
        </button>

        <nav className="hidden items-center rounded-2xl border border-[#183B2B]/8 bg-white/75 p-1 shadow-sm backdrop-blur-md md:flex">
          {navLinks.map((link) => {
            const isActive = activeScreen === link.id || (activeScreen === 'recommendations' && link.id === 'cook');
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`relative rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#183B2B] text-white shadow-sm'
                    : 'text-[#1C2520]/65 hover:bg-[#EAF2EC] hover:text-[#183B2B]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('profile')}
            className="hidden items-center gap-2 rounded-full border border-[#183B2B]/10 bg-white/75 px-3 py-2 text-[11px] font-semibold text-[#183B2B] shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-md lg:flex"
          >
            <span className="h-2 w-2 rounded-full bg-[#42A47A] shadow-[0_0_10px_rgba(66,164,122,0.5)]" />
            <span>{userProfile.name}</span>
            <span className="text-[#183B2B]/35">·</span>
            <span className="text-[#183B2B]/60">{userProfile.identity}</span>
          </button>

          <button
            onClick={() => onNavigate('cook')}
            className="group inline-flex items-center gap-2 rounded-2xl bg-[#E86C38] px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_10px_24px_rgba(232,108,56,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#F27B46] hover:shadow-[0_13px_28px_rgba(232,108,56,0.28)] active:translate-y-0"
          >
            <span>What can I cook?</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </header>
  );
};
