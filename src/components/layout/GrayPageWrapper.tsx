import React from 'react';

interface GrayPageWrapperProps {
  children: React.ReactNode;
}

export default function GrayPageWrapper({ children }: GrayPageWrapperProps) {
  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 28px)', // MainLayout padding (14px * 2) 제외     
        margin: '0 auto',
        backgroundColor: '#F3F4F6', // gray-100
        borderRadius: '16px',
        padding: '35px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        boxShadow: '-2px 2px 2px 3px rgba(0,0,0,0.08)',
      }}
    >
      {children}
    </div>
  );
}
