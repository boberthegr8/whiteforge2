import { useState, useEffect } from 'react';
import { AppProvider, useAppStore } from './lib/store';
import { ToastProvider } from './lib/toast';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { DeliveryBoard } from './pages/DeliveryBoard';
import { CalendarPage } from './pages/CalendarPage';
import { QuotesPage } from './pages/QuotesPage';
import { ContactsPage } from './pages/ContactsPage';
import { PipelinePage } from './pages/PipelinePage';
import { UsersPage } from './pages/UsersPage';
import { StoresPage } from './pages/StoresPage';
import { TodosPage } from './pages/TodosPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PunchClockPage } from './pages/PunchClockPage';
import { PayrollPage } from './pages/PayrollPage';
import { WorkforcePage } from './pages/WorkforcePage';
import { LoginPage } from './pages/LoginPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

const PAGE_ROLES: Record<string, string[]> = {
  dash:      ['admin', 'sales', 'counter'],
  contacts:  ['admin', 'sales', 'counter'],
  quotes:    ['admin', 'sales', 'counter'],
  pipeline:  ['admin', 'foreman', 'sales', 'counter'],
  todos:     ['admin', 'foreman', 'driver', 'sales', 'counter'],
  delivery:  ['admin', 'foreman', 'driver', 'sales', 'counter', 'store'],
  calendar:  ['admin', 'foreman', 'sales', 'counter'],
  workforce: ['admin'],
  users:     ['admin'],
  stores:    ['admin'],
  analytics: ['admin', 'sales'],
  payroll:   ['admin'],
  punch:     ['admin', 'foreman', 'driver', 'counter'],
};

const PAGE_TITLES: Record<string, string> = {
  dash: 'Dashboard', delivery: 'Delivery Board', calendar: 'Calendar',
  contacts: 'Contacts', quotes: 'Quotes', pipeline: 'Pipeline',
  todos: 'To-do List', users: 'Users', stores: 'Stores', analytics: 'Analytics',
  payroll: 'Payroll', punch: 'Punch Clock', workforce: 'Workforce',
};

function AppContent() {
  const [currentPage, setPage] = useState('dash');
  const { currentUser, isLoggedIn } = useAppStore();

  useEffect(() => {
    if (currentUser?.role) {
      const allowed = PAGE_ROLES[currentPage];
      if (allowed && !allowed.includes(currentUser.role)) {
        if (currentUser.role === 'driver' || currentUser.role === 'store') setPage('delivery');
        else if (currentUser.role === 'foreman') setPage('pipeline');
        else setPage('dash');
      }
    }
  }, [currentUser, currentPage]);

  if (!isLoggedIn) return <LoginPage />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dash':      return <Dashboard />;
      case 'delivery':  return <DeliveryBoard />;
      case 'calendar':  return <CalendarPage />;
      case 'contacts':  return <ContactsPage />;
      case 'quotes':    return <QuotesPage />;
      case 'pipeline':  return <PipelinePage />;
      case 'workforce': return <WorkforcePage />;
      case 'users':     return <UsersPage />;
      case 'stores':    return <StoresPage />;
      case 'todos':     return <TodosPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'payroll':   return <PayrollPage />;
      case 'punch':     return <PunchClockPage />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] w-full overflow-hidden text-sm">
      <Sidebar currentPage={currentPage} setPage={setPage} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={PAGE_TITLES[currentPage] || 'Dashboard'} />
        <div className="flex-1 relative overflow-hidden">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AppProvider>
    </GoogleOAuthProvider>
  );
}
