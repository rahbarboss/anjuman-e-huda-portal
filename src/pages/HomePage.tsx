import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { LatestProgramsAndAnnouncements } from '../components/LatestProgramsAndAnnouncements';
import { AboutSection } from '../components/AboutSection';

interface Props {
  onOpenNotifications: () => void;
}

export const HomePage: React.FC<Props> = ({ onOpenNotifications }) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Landing Section */}
      <HeroSection />

      {/* 2. Latest Programs & Active Colloquiums Highlight */}
      <LatestProgramsAndAnnouncements onOpenNotifications={onOpenNotifications} />

      {/* 3. The Soul of ANJUMAN-E-HUDA, Vision & 4 Pillars */}
      <AboutSection />
    </div>
  );
};
