import React from 'react';
import { DeveloperDashboard, DeveloperDashboardProps } from './DeveloperDashboard';

export { DeveloperDashboard };
export type { DeveloperDashboardProps };

// Backwards-compatible export
export const DeveloperTechConsole: React.FC<DeveloperDashboardProps> = (props) => {
  return <DeveloperDashboard {...props} />;
};
