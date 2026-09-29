import React from 'react';
import { LandingPage } from '../landing/LandingPage';

export interface PreLaunchPageProps {
  onEnterApp?: () => void;
}

export const PreLaunchPage: React.FC<PreLaunchPageProps> = ({ onEnterApp }) => {
  return <LandingPage onEnterApp={onEnterApp} />;
};
