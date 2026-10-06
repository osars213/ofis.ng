import React from 'react';
import { SpaceList } from '../SpaceList';

export interface PreLaunchPageProps {
  onEnterApp?: () => void;
}

export const PreLaunchPage: React.FC<PreLaunchPageProps> = () => {
  return <SpaceList />;
};
