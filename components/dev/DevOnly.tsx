import React from 'react';

interface DevOnlyProps {
  children: React.ReactNode;
}

export const DevOnly: React.FC<DevOnlyProps> = ({ children }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  return <>{children}</>;
};

export default DevOnly;
