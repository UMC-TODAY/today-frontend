import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import GrayPageWrapper from './GrayPageWrapper';

export default function MainLayout() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        background: '#ffffff',
        padding: '14px',
        overflow: 'hidden',
        minWidth: 0
      }}>
        <GrayPageWrapper>
          <Outlet />
        </GrayPageWrapper>
      </main>
    </div>
  );
}
