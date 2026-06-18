import { StoreProvider } from '@/app/store/StoreContext';
import { AppLayout } from '@/layouts/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';

export default function App() {
  return (
    <StoreProvider>
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </StoreProvider>
  );
}
