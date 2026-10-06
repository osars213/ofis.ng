import React from 'react';

interface OfisAssistantIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withRing?: boolean;
}

/**
 * OfisAssistantIcon: Removed per user branding requirements (no logo/icon for Ofis Assistant).
 */
export const OfisAssistantIcon: React.FC<OfisAssistantIconProps> = () => {
  return null;
};
