import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

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
        background: '#f9fafb',
        padding: '40px',
        overflowY: 'auto',
        minWidth: 0
      }}>
        <Outlet />
      </main>
    </div>
  );
}
