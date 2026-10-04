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
  userProfile,
  onOpenOnboarding
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
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#183B2B]/10">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-[#183B2B] flex items-center justify-center text-white shadow-xs group-hover:bg-[#132E22] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" opacity="0.2"/>
              <path d="M12 6v12M6 12h12" />
              <path d="M8 8l8 8" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#183B2B]">
            SavorAI
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="flex items-center gap-1 md:gap-2">
          {navLinks.map((link) => {
            const isActive = activeScreen === link.id || (activeScreen === 'recommendations' && link.id === 'cook');
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#183B2B] font-semibold bg-[#EAF2EC]'
                    : 'text-[#1C2520]/75 hover:text-[#183B2B] hover:bg-[#F2EFE8]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-[#183B2B] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Profile context preview button */}
          <button
            onClick={() => onNavigate('profile')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF2EC] text-[#183B2B] text-xs font-medium border border-[#183B2B]/15 hover:bg-[#DCEADE] transition-colors cursor-pointer"
            title="Current Kitchen Profile"
          >
            <span className="w-2 h-2 rounded-full bg-[#183B2B]" />
            <span className="font-semibold">{userProfile.name}</span>
            <span className="text-[#183B2B]/60">·</span>
            <span>{userProfile.identity}</span>
          </button>

          {/* Quick CTA to find meals */}
          <button
            onClick={() => onNavigate('cook')}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#183B2B] rounded-xl hover:bg-[#132E22] active:scale-[0.98] transition-all shadow-xs cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <span>What can I cook?</span>
          </button>
        </div>
      </div>
    </header>
  );
};
